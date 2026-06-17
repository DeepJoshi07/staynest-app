import cloudinary from "../config/cloudinary.js";
import Listing from "../models/listing.model.js";
import Review from "../models/review.model.js";
import Booking from "../models/booked.model.js";

export const allListings = async (req, res) => {
  const listings = await Listing.find().populate("host");
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

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: "No images privided!",
    });
  }

  const uploadPromises = req.files.map((file, index) => {
    return new Promise((resolve, reject) => {
      const publicId = `img_${Date.now()}_${index}`;
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "staynest",
          public_id: publicId,
        },
        (error, result) => {
          if (error) reject(error);
          else
            resolve({
              imageUrl: result.secure_url,
              publicId: result.public_id,
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
    host: req.userId,
    images: result,
    //rating,reviews,
  });

  await listing.populate("host");

  if (!listing) {
    return res.status(500).json({ message: "internal server error!" });
  }

  return res.status(200).json({ listing });
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
    id,
  } = req.body;

  let result;

  const oldListing = await Listing.findById(id);

  if (!oldListing) {
    return res.status(400).json({
      message: "listing not found!",
    });
  }

  const publicIds = oldListing.images.map((img) => img.publicId);

  if (req.files && req.files.length > 0) {
    try {
      const result = await cloudinary.api.delete_derived_resources(publicIds, {
        resource_type: "image",
      });
      const uploadPromises = req.files.map((file, index) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "staynest",
              public_id: `img_${Date.now()}_${index}`,
            },
            (error, result) => {
              if (error) reject(error);
              else
                resolve({
                  imageUrl: result.secure_url,
                  publicId: result.public_id,
                });
            },
          );
          stream.end(file.buffer);
        });
      });
      result = await Promise.all(uploadPromises);
    } catch (error) {
      console.log("image upload error", error);
      return res.status(500).json({
        message: "image upload error",
      });
    }
  }

  const listing = await Listing.findByIdAndUpdate(
    id,
    {
      title,
      guests,
      location,
      price,
      bedrooms,
      bathrooms,
      description,
      amenities,
      ...(result !== null && result.length > 0 && { images: result }),
      //rating,reviews,
    },
    { new: true },
  ).populate("host");

  if (!listing) {
    return res.status(500).json({
      message: "internal server error!",
    });
  }

  return res.status(200).json({
    message: "listing updated successfully!",
    listing,
  });
};

export const listingDetail = async (req, res) => {
  const id = req.query.id;
  const listing = await Listing.findById(id).populate("host");

  if (!listing) {
    return res.status(400).json({
      message: "listing not found!",
    });
  }

  return res.status(200).json({ listing });
};

export const bookListing = async (req, res) => {
  const { price, from, till, people, listingId } = req.body;
  //listingId, guestId, from, till, payment, reserved, reservedTill, expireAt, people, price
  const booking = await Booking.create({
    price,
    from,
    till,
    people,
    expireAt: till,
    listingId,
    guestId: req.userId,
    payment: "pendding",
    reserved: true,
    reservedTill: Date.now() + 2 * 24 * 60 * 60 * 1000,
  });

  if (!booking) {
    return res.status(500).json({
      message: "internal server error",
    });
  }

  return res.status(200).json({
    message: "Your booking has reserved. Please make payment to confirm!",
  });
};

export const myBookings = async (req, res) => {
  const id = req.userId;

  const bookings = await Booking.find({
    guestId: id,
  }).populate("listingId");

  if (!bookings) {
    return res.status(200).json({
      message: "no bookings found!",
    });
  }

  return res.status(200).json({ bookings });
};

export const deleteListing = async (req, res) => {
  const id = req.query.id;

  const listing = await Listing.findByIdAndDelete(id);

  if (!listing) {
    return res.status(400).json({
      message: "Listing not found!",
    });
  }
  const publicIds = listing.images.map((i) => i.publicId);

  await cloudinary.api.delete_resources(publicIds);

  await Review.deleteMany({ listingId: listing._id });

  return res.status(200).json({ listing });
};
