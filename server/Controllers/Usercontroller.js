const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const EmployeeData = require('../models/User');
const crypto = require('crypto');

// Temporary storage for OTPs
let otps = {};

// Setup email transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chinnuvenki6@gmail.com', // Use your email
        pass: 'twdr jivb ylbi gxni', // Use your email password or app-specific password
    },
});

// Signup Function
const Signup = (req, res) => {
    const { username, email, password } = req.body;

    // Generate an OTP with 8 characters (Alphanumeric + Special Characters)
    const otp = otpGenerator.generate(8, {
        upperCase: true,   // Allow uppercase letters
        specialChars: true // Allow special characters
    });

    otps[email] = otp;

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
                res.json('user not found');
            }
        })
        .catch(err => console.log(err));
};

// Forgot Password Function
const forgotPassword = (req, res) => {
    const { email } = req.body;

    EmployeeData.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json('User not found');
            }

            // Generate a reset token and expiration date
            const token = crypto.randomBytes(20).toString('hex');
            const expireTime = Date.now() + 3600000; // 1 hour expiry

            user.resetPasswordToken = token;
            user.resetPasswordExpires = expireTime;

            // Save the user with the reset token and expiry
            user.save()
                .then(() => {
                    // Send email with reset link
                    const resetUrl = `http://localhost:3000/reset-password/${token}`;
                    const mailOptions = {
                        from: 'your-email@gmail.com',
                        to: email,
                        subject: 'Password Reset Request',
                        text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
                    };

                    transporter.sendMail(mailOptions, (error) => {
                        if (error) {
                            return res.status(500).send('Error sending reset email');
                        }
                        res.json('Password reset link sent to your email');
                    });
                })
                .catch(err => res.status(500).json('Error saving reset token'));
        })
        .catch(err => res.status(500).json('Server error'));
};

// Reset Password Function
const resetPassword = (req, res) => {
    const { token, newPassword } = req.body;

    EmployeeData.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(400).json('Invalid or expired reset token');
            }

            // Update the password
            user.password = newPassword;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            user.save()
                .then(() => res.json('Password successfully reset'))
                .catch(err => res.status(500).json('Error resetting password'));
        })
        .catch(err => res.status(500).json('Server error'));
};

module.exports = { Signup, Login, verifyOtp, forgotPassword, resetPassword };
