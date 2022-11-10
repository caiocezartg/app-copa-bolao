import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const jwtToken = authHeader?.split(" ")[1];

  if (!jwtToken) {
    return res.status(400).json({ error: "JWT not found!" });
  }

  try {
    const data = jwt.verify(jwtToken, "jwtsecretplaceholder");
    req.userData = data;
    return next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export default authenticate;
