import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    mylistings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "listing",
    },
    mybookings: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "listing",
    },
    image: {
      imageUrl: {
        type: String,
        required: [true, "ImageUrl is required"],
      },
      publicId: {
        type: String,
        required: [true, "PublicId required"],
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", authSchema);

export default User;
