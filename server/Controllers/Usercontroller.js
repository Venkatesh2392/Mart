const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const EmployeeData = require('../models/User');

let otps = {}; // Temporary storage for OTPs

// SignUp Function
const Signup = (req, res) => {
    const { username, email, password } = req.body;

    // Generate an OTP with 8 characters (Alphanumeric + Special Characters)
    const otp = otpGenerator.generate(8, {
        upperCase: true,   // Allow uppercase letters
        specialChars: true // Allow special characters
    });
    
    otps[email] = otp;

    // Setup the email transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chinnuvenki6@gmail.com', // Use your email
            pass: 'twdr jivb ylbi gxni', // Use your email password or app-specific password
        },
    });

    // Email Options
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    // Send OTP Email
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.status(500).send('Error sending OTP');
        }

        // Create a new user in the database
        EmployeeData.create({ username, email, password })
            .then(() => res.json({ message: 'OTP sent to email' }))
            .catch(err => {
                console.error(err);
                res.status(500).send('Error creating user');
            });
    });
};

// Verify OTP Function
const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    if (otps[email] && otps[email] === otp) {
        delete otps[email]; // Remove OTP after verification
        return res.json('OTP verified successfully!');
    } else {
        return res.status(400).json('Invalid or expired OTP');
    }
};

// Login Function
const Login = (req, res) => {
    const { email, password } = req.body;

    EmployeeData.findOne({ email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json('success');
                } else {
                    res.json('password is incorrect');
                }
            } else {
                res.json('user not found!!!');
            }
        })
        .catch(err => console.log(err));
};

module.exports = { Signup, Login, verifyOtp };
