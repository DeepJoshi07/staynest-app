import mongoose from "mongoose"

const listingSchema = new mongoose.Schema({
    title: {
        type:String,
        required:[true,"Title is required"]
    },
    location: {
        type:String,
        required:[true,"Location is required"]
    },
    price: {
        type:Number,
        required:[true,"Price is required"]
    },
    rating: {},
    guests: {
        type:Number,
        required:[true,"Guests is required"]
    },
    bedrooms: {
        type:Number,
        required:[true,"Bedrooms is required"]
    },
    bathrooms: {
        type:Number,
        required:[true,"Bathrooms is required"]
    },
    description: {
        type:String,
        required:[true,"Description is required"]
    },
    amenities: {
        type:[
            String
        ],
        // enum:["Wifi", "Pool", "Free parking", "Kitchen","Air conditioning","Free parking","Washer"],
        required:[true,"amenities are required"]
    },
    images: {
        type:[String],
        require:[true,"Images are required"]
    },
    host: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"Host is required"]
    },
    reviews: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"reviews"
    }],
},{
    timestamps:true
});

const Listings = mongoose.model("listing",listingSchema)

export default Listings;