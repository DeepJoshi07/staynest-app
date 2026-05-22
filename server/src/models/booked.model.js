import mongoose from "mongoose";

const bookedSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "listing",
      required: [true, "Listing is required"],
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "GuestId is required"],
    },
    from: {
      type: Date,
      required: [true, "Starting date is required"],
    },
    till: {
      type: Date,
      required: [true, "Ending date is required"],
    },
    expireAt: {
      type: Date,
      required: true,
      // this will be set equal to `till`
    },
    people: {
      type: Number,
      required: [true, "Number of people required"],
      min: 1,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    reserved:{
        type:Boolean,
        required:[true,"reserved must be set"]
    },
    reservedTill:{
        type:Date,
        required:[true,"reserve time required"]
    },
    payment:{
        type:[String],
        enum:["conformed","pendding"]
    }
  },
  {
    timestamps: true,
  },
);

// TTL index: delete document when expireAt is reached
bookedSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
bookedSchema.index({reservedTill:1},{expireAfterSeconds:0})

const Booking = mongoose.model("booking", bookedSchema);

export default Booking;
