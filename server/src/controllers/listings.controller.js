import cloudinary from "../config/cloudinary.js";
import Listing from "../models/listing.model.js";
import Review from "../models/review.model.js";
import Booking from "../models/booked.model.js";

export const allListings = async (req, res) => {
  const listings = await Listing.find();
  if (!listings) {
    return res.status(500).json({ message: "internal server error!" });
  }
  return res.status(200).json(listings);
};

export const newListing = async (req, res) => {
  const {
    title,
    description,
    location,
    price,
    guests,
    bedrooms,
    bathrooms,
    amenities,
  } = req.body;

  if (!req.files || req.files.listing === 0) {
    return res.status(400).json({
      message: "No images privided!",
    });
  }
  const uploadPromises = req.files.map((file, index) => {
    return Promise((resolve, reject) => {
      const publicId = `img_${Date.now()}_${index}`;
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "staynest",
          public_id: publicId,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve({
                imageUrl:result.secure_url,
                publicId:result.public_id
          });
        },
      );
      stream.end(file.buffer);
    });
  });

  const result = await Promise.all(uploadPromises);

  const listing = await Listing.create({
    title,
    guests,
    location,
    price,
    bedrooms,
    bathrooms,
    description,
    amenities,
    host:req.userId,
    images: result,
    //rating,reviews,
  });

  if (!listing) {
    return res.status(500).json({ message: "internal server error!" });
  }
  return res.status(200).json(listing);
};

export const editListing = async (req, res) => {
  const {
    title,
    description,
    location,
    price,
    guests,
    bedrooms,
    bathrooms,
    amenities,
  } = req.body;

  if (req.files || req.files.listing > 0) {
    const uploadPromises = req.files.map((file, index) => {
      return Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "staynest",
            public_id: `img_${Date.now()}_${index}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
                imageUrl:result.secure_url,
                publicId:result.public_id
          });
          },
        );
        stream.end(file.buffer);
      });
    });
    const result = await Promise.all(uploadPromises);
  }

  const listing = await Listing.findByIdAndUpdate(req.userId,{
    title,
    guests,
    location,
    price,
    bedrooms,
    bathrooms,
    description,
    amenities,
    ...(result.legnth > 0 && {images:result})
    //rating,reviews,
  });

  if(!listing){
        return res.status(500).json({
            message:"internal server error!"
        })
    }

    return res.status(200).json({
        message:"listing updated successfully!",
        listing
    })
};
export const listingDetail = async(req, res) => {
    const {id} = req.body;

    const listing = await Listing.findById(id);

    if(!listing){
        return res.status(400).json({
            message:"listing not found!"
        })
    }

    return res.status(200).json(listing)
};

export const bookListing = async(req, res) => {
    const {price,from,till,people,listingId} = req.body;
    //listingId, guestId, from, till, payment, reserved, reservedTill, expireAt, people, price

    const booking = await Booking.create({
      price,
      from,
      till,
      people,
      expireAt:till,
      listingId,
      guestId:req.userId,
      payment:"pendding",
      reserved:true,
      reservedTill:Date.now() + 2 * 24 * 60 * 60 * 1000
    });

    if(!booking){
      return res.status(500).json({
        message:"internal server error"
      })
    }

    return res.status(200).json({
      message:"Your booking has reserved. Please make payment to confirm!"
    })
};
