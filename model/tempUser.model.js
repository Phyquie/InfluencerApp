import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
        trim: true
    },
   
    profileImg:{
        type: String,
        default: "",
    },
    otp: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
  otpExpiresAt: {
    type: Date,
    required: true,
  },

},
    {timestamps: true});


const TempUser = mongoose.model("TempUser", tempUserSchema);
export default TempUser;