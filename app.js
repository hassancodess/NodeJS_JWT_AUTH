require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

// Models
const User = require("./models/user")
const Video = require('./models/video')

// Middleware
const auth = require('./middleware/auth')

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('root')
    // res.status(200).send("Welcome")
})

app.get('/welcome', auth, (req, res) => {
    res.status(200).send("Welcome")
})

app.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, } = req.body

        // Validate user input
        if (!(first_name && last_name && email && password)) {
            return res.status(400).json("All inputs are required");
        }

        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User Already Exists. Please Login");
        }

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: password,
        });

        return res.status(201).json("User Registered")
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate user input
        if (!(email && password)) {
            return res.status(400).json("All inputs are required");
        }

        // Validate if user exist in our database
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "20s",
                }
            );

            // save user token
            user.token = token;
            // return user
            return res.status(201).json(user)
        }
        return res.status(400).json("Invalid Credentials");
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message })
    }
})

app.post('/saveVideo', auth, async (req, res) => {
    try {
        const { name, format, file_path, userID } = req.body

        const video = await Video.create({
            name,
            format,
            file_path,
            userID
        })
        return res.status(200).json(video);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message })
    }
})


module.exports = app;