import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    guests: {
      type: Number,
      required: [true, "Guests is required"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Bedrooms is required"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Bathrooms is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    amenities: {
      type: [String],
      enum: [
        "Wifi",
        "Pool",
        "Free parking",
        "Kitchen",
        "Air conditioning",
        "Washer",
      ],
      required: [true, "amenities are required"],
    },
    images: {
      type: [
        {
          imageUrl:{
            type:String,
            required:[true,"ImageUrl is required"]
          },
          publicId:{
            type:String,
            required:[true,"PublicId required"]
          }
        }
      ],
      required: [true, "Images are required"],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Host is required"],
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Listings = mongoose.model("listing", listingSchema);

export default Listings;
