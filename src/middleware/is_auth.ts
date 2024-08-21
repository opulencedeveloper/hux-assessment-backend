import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { CustomRequest, DecodedToken } from "../utils/interface";
import { MessageResponse } from "../utils/enum";

dotenv.config();

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.get("Authorization");

  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({
      status: MessageResponse.Error,
      message: "Not authenticated. Authorization header missing.",
      data: null,
    });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    if (!token) {
      throw new Error("Token missing");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decodedToken) {
      return res.status(401).json({
        status: MessageResponse.Error,
        message: "Not authenticated. Invalid token.",
        data: null,
      });
    }

    // Attach the user ID to the request object
    (req as CustomRequest).userId = decodedToken.userId;

    next();
  } catch (err) {
    return res.status(401).json({
      status: MessageResponse.Error,
      message: "Not authenticated. Token verification failed.",
      data: null,
    });
  }
};

// import jwt, { JwtPayload } from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";

// import { CustomRequest, DecodedToken } from "../utils/interface";
// import { MessageResponse } from "../utils/enum";

// dotenv.config();

// export const isAuth = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.get("Authorization");

//   if (!authHeader) {
//     return res.status(401).json({
//       status: MessageResponse.Error,
//       message: "Not authenticated1",
//       data: null,
//     });
//   }
//   const token = authHeader.split(" ")[1];

//   let decodedToken;

//   try {
//     decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
//   } catch (err) {
//     return res.status(401).json({
//       status: MessageResponse.Error,
//       message: "Not authenticated2",
//       data: null,
//     });
//   }

//   if (!decodedToken) {
//     return res.status(401).json({
//       status: MessageResponse.Error,
//       message: "Not authenticated",
//       data: null,
//     });
//   }
//   (req as CustomRequest).userId = decodedToken.userId;
//   next();
// };
