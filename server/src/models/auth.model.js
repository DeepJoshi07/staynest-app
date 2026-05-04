import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },

},{
    timestamps:true
});

const User = mongoose.model("user",authSchema);

export default User;