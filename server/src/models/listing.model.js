import mongoose from "mongoose"

const listingSchema = new mongoose.Schema({
    title: {},
    location: {},
    price: {},
    rating: {},
    guests: {},
    bedrooms: {},
    bathrooms: {},
    description: {},
    amenities: {},
    images: {},
    host: {},
    reviews: {},
});

const Listings = mongoose.model("listing",listingSchema)

export default Listings;