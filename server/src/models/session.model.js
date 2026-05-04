import mongoose from "mongoose";
import { refreshToken } from "../controllers/auth.controller";

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "UserID is required"],
  },
  refreshTokenHash: {
    type: String,
    required: [true, "Refresh Token is required"],
  },
  ip: {
    type: String,
    required: [true, "Ip is required"],
  },
  userAgent: {
    type: String,
    required: [true, "User agent is required"],
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
  revokedAt: {
    type: Date,
    default: null,
  },
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
sessionSchema.index(
  { revokedAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 },
);

const Session = mongoose.model("session", sessionSchema);

export default Session;
