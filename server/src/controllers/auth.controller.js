import User from "../models/auth.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";
import cloudinary from "../config/cloudinary.js";

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

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "User created!",
    user: {
      username: user.username,
      email: user.email,
      image: user.image || ""
    },
    accessToken,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "User does not exists",
    });
  }

  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const isPassword = user.password === hashPassword;

  if (!isPassword) {
    return res.status(400).json({
      message: "invalid credentials!",
    });
  }

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
    ip: req.ip,
    refreshTokenHash,
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

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "user logged in successfully!",
    user: {
      username: user.username,
      email: user.email,
      image:user.image || " "
    },
    accessToken,
  });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
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

  session.revoked = true;
  session.revokedAt = new Date();
  session.expiresAt = null;

  await session.save();

  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "user logged out successfully!",
  });
};

export const refreshToken = async (req, res) => {
  const newRfreshToken = jwt.sign(
    {
      id: req.userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  const accessToken = jwt.sign(
    {
      id: req.userId,
      sessionId: req.sessionId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const newRfreshTokenHash = crypto
    .createHash("sha256")
    .update(newRfreshToken)
    .digest("hex");

  const session = await Session.findById(req.sessionId);

  session.refreshTokenHash = newRfreshTokenHash;
  session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await session.save();

  const user = await User.findById(req.userId);

  res.cookie("refreshToken", newRfreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "access token refreshed successfully!",
    user,
    accessToken,
  });
};

export const updateImage = async (req, res) => {
  const fileBuffer = req.file.buffer;
  
  const user = await User.findById(req.userId);

  if(!user){
    return res.status(400).json({message:"User not found!"})
  }
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "staynest",
        public_id: `img_${Date.now()}`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(fileBuffer)
  });

  user.image = result.secure_url;
  user.save()

  res.status(200).json({ user:{
    username:user.username,
    email:user.email,
    image:user.image
  } });
};

// export const logoutAll = async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(400).json({
//       message: "refresh token not found",
//     });
//   }

//   const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

//   if (!decoded) {
//     return res.status(400).json({
//       message: "invalid refresh token",
//     });
//   }
//   console.log(decoded.id);
//   await Session.updateMany(
//     {
//       user: decoded.id,
//       revoked: false,
//     },
//     {
//       $set: {
//         revokedAt: new Date(),

//         revoked: true,
//       },
//       $unset:{
//         expiresAt: "",
//       }
//     },
//   );

//   res.clearCookie("refreshToken");

//   return res.status(200).json({
//     message: "user logged out from all devices successfully!",
//   });
// };
