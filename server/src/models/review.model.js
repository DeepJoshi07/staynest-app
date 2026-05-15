import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"Author is required"]
    },
    rating:{
        type:Number,
        required:[true,"Rating is required"]
    },
    comment:{
        type:String,
        required:[true,"Comment is required"]
    }
},{
    timestamps:true
});

const Review = mongoose.model("review",reviewSchema);

export default Review;