import User from "../models/auth.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const alreadyExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (alreadyExists) {
    return res.status(429).json({
      message: "User already exists!",
    });
  }

  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const user = await User.create({
    username,
    email,
    password: passwordHash,
  });

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await Session.create({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge:7*24*60*60*1000
  })

  return res.status(200).json({
    message:"User created!",
    user:{
        username:user.username,
        email:user.email
    },
    accessToken
  })
};

export const login = async (req, res) => {
  res.send("hello!");
};

export const logout = async (req, res) => {
  res.send("hello!");
};

export const refreshToken = async (req, res) => {
  res.send("hello!");
};
