import express, { request } from "express";
import { prisma } from "../lib/prisma";
import validate from "../middlewares/validateMiddleware";
import authSchema from "../validations/authValidation";
import jwt from "jsonwebtoken";
import authenticate from "../middlewares/authenticate";

export const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
  return res.json({ user: req.userData });
});

router.post("/users", validate(authSchema), async (req, res) => {
  const { access_token } = req.body;

  const userResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const userData = await userResponse.json();

  let user = await prisma.user.findUnique({
    where: {
      googleId: userData.id,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        googleId: userData.id,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.picture,
      },
    });
  }

  const token = jwt.sign(
    {
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    "jwtsecretplaceholder",
    {
      expiresIn: "7 days",
    }
  );

  return res.json({ token });
});
