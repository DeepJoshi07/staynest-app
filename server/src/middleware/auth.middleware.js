import jwt from "jsonwebtoken"
import crypto from "crypto"
import Session from "../models/session.model.js"

export const authUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        message: "refresh token not found!",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({
        message: "invalid refresh token!",
      });
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await Session.findOne({
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return res.status(400).json({
        message: "invalid refresh token!",
      });
    }

    req.sessionId = session._id;
    req.userId = decoded.id // userid
    next();
  } catch (error) {
    console.log("user verification middleware error", error);
  }
};
