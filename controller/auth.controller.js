import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import express from "express";
import nodemailer from "nodemailer";
import TempUser from "../model/tempUser.model.js";
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: '79ac62002@smtp-brevo.com',
            pass: process.env.BREVEO_PASS
        }
    });

    const mailOptions = {
        from: 'Phyquie <ayushking6395@gmail.com>',
        to: email,
        subject: 'Your OTP Code for CodeAxes',
        text: `Your OTP code is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error sending email:', error);
        }
        console.log('Message sent: %s', info.messageId);
    });



};
export const signup = async (req, res) => {
    try {
        const { fullname, username, email, password, userType } = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: "Invalid email Format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ message: "Username already taken" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send({ message: "Email already taken" });
        }
        if (password.length < 6) {
            return res.status(400).send({ message: "Password must be atleast 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOTP();
        await sendOTPEmail(email, otp);

        const existingTempUser = await TempUser.findOne({ email });
        if (existingTempUser) {
            await TempUser.deleteMany({ email });
        }

        const tempUserObj = new TempUser({
            fullname,
            username,
            email,
            otp,
            password: hashedPassword,
            userType,
            otpExpiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
        });

        if (tempUserObj) {
            await tempUserObj.save();
            res.status(201).send({ message: "OTP sent to email" });
        } else {
            res.status(500).send({ message: "Something went wrong" });
        }


    } catch (error) {
        console.log(error);
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;


        const otpEntry = await TempUser.findOne({ email });
        console.log(otpEntry);

        if (!otpEntry) {
            return res.status(400).send({ message: 'OTP not found. Please sign up again.' });
        }


        const isValidOTP = (otpEntry.otp === otp) && (Date.now() < otpEntry.otpExpiresAt);

        if (!isValidOTP) {
            return res.status(400).send({ message: 'Invalid or expired OTP' });
        }


        const newUser = new User({
            fullname: otpEntry.fullname,
            username: otpEntry.username,
            email: otpEntry.email,
            password: otpEntry.password,
            userType: otpEntry.userType
        });

        await newUser.save();


        await TempUser.deleteMany({ email });


        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            fullname: newUser.fullname,
            userType: newUser.userType,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Something went wrong' });
    }
};

export const login = async (req, res) => {
    try{

        const {email, password} = req.body;
        const user = await User.findOne({email});
        const isPasswordValid = user && await bcrypt.compare(password, user.password);
if(!user || !isPasswordValid){
    return res.status(400).send({message: "Email or Password is worng"});}
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({_id:user._id,
        username:user.username, email:user.email, 
       fullname:user.fullname,
       userType:user.userType,
       });

    }
    catch(error){
        console.log("error in login controller", error);
        res.status(500).send({message: "Something went wrong"});
    }};

export const logout = async (req, res) => {  
      try {res.cookie("jwt", "", {maxAge:0})
      res.status(200).send({message: "Logged out successfully"});}
      catch (error) {
        console.log("error in logout controller", error);}  };

export const getMe = async (req, res) => {
    try{const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    }
    catch (error) {
        console.log("error in getMe controller", error);
        res.status(500).send({message: "Something went wrong"});}
};        



