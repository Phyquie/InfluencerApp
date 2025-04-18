import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    fullname : {
        type: String,
        required: true,
       
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
   
    profileImg:{
        type: String,
        default: "",
    },
    userType: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
},
    {timestamps: true});


const User = mongoose.model("User", userSchema);
export default User;