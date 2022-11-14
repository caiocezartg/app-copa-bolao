import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface dataDecodedProps {
  name: string;
  avatarUrl: string;
  sub: string;
  iat: number;
  exp: number;
}

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
    const dataDecoded = jwt.verify(jwtToken, "jwtsecretplaceholder");
    const { name, avatarUrl, sub, iat, exp } = dataDecoded as dataDecodedProps;
    req.userData = {
      name,
      avatarUrl,
      sub,
      iat,
      exp,
    };
    return next();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export default authenticate;
