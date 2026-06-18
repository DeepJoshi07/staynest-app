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

  // Find all active unexpired pending reservations for this listing
  const activeReservations = await Booking.find({
    listingId: id,
    payment: "pendding",
    reserved: true,
    reservedTill: { $gt: new Date() },
  });

  // Generate intermediate dates for these reservations
  const reservedDates = [];
  for (const reservation of activeReservations) {
    const start = new Date(reservation.from);
    const end = new Date(reservation.till);
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    const current = new Date(start);
    while (current <= end) {
      reservedDates.push(new Date(current));
      current.setUTCDate(current.getUTCDate() + 1);
    }
  }

  // Combine confirmed bookedDates and pending reservedDates
  const allUnavailableDates = [
    ...(listing.bookedDates || []),
    ...reservedDates,
  ].map((d) => new Date(d).toISOString());

  // Filter unique dates
  const uniqueUnavailableDates = [...new Set(allUnavailableDates)].map((d) => new Date(d));

  const listingObj = listing.toObject();
  listingObj.bookedDates = uniqueUnavailableDates;

  return res.status(200).json({ listing: listingObj });
};

export const bookListing = async (req, res) => {
  const { price, from, till, people, listingId } = req.body;

  const requestedFrom = new Date(from);
  const requestedTill = new Date(till);

  // Find any active overlapping booking or reservation for the same listing
  const overlapping = await Booking.findOne({
    listingId,
    from: { $lte: requestedTill },
    till: { $gte: requestedFrom },
    $or: [
      { payment: "conformed" },
      {
        reserved: true,
        reservedTill: { $gt: new Date() },
      },
    ],
  });

  if (overlapping) {
    return res.status(400).json({
      message: "The selected dates are already booked or reserved. Please choose other dates.",
    });
  }

  // listingId, guestId, from, till, payment, reserved, reservedTill, expireAt, people, price
  const booking = await Booking.create({
    price,
    from: requestedFrom,
    till: requestedTill,
    people,
    expireAt: requestedTill,
    listingId,
    guestId: req.userId,
    payment: "pendding",
    reserved: true,
    reservedTill: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
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

/**
 * Adds all dates from 'from' to 'till' (inclusive) to the listing's bookedDates.
 * Ensures there are no duplicate dates.
 * @param {string} listingId - The ID of the listing to update.
 * @param {Date|string} from - The starting date of the booking.
 * @param {Date|string} till - The ending date of the booking.
 */
export const addBookedDatesToListing = async (listingId, from, till) => {
  const dates = [];
  const start = new Date(from);
  const end = new Date(till);

  // Normalize dates to UTC start-of-day to prevent timezone shifts and duplicate values
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);

  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setUTCDate(current.getUTCDate() + 1);
  }

  // Use $addToSet with $each to ensure no duplicate Date entries in the MongoDB array
  const updatedListing = await Listing.findByIdAndUpdate(
    listingId,
    {
      $addToSet: { bookedDates: { $each: dates } },
    },
    { new: true }
  );

  return updatedListing;
};
