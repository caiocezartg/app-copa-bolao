import { prisma } from "../lib/prisma";
import express from "express";

export const router = express.Router();

router.get("/count", async (req, res) => {
  const count = await prisma.guess.count();

  return res.json({
    count,
  });
});
