import { prisma } from "../lib/prisma";
import validate from "../middlewares/validateMiddleware";
import poolSchema from "../validations/poolValidation";
import express from "express";
import ShortUniqueId from "short-unique-id";

export const router = express.Router();

router.get("/count", async (req, res) => {
  const count = await prisma.pools.count();

  return res.json({
    count,
  });
});

router.post("/", validate(poolSchema), async (req, res) => {
  const { title } = req.body;
  const generate = new ShortUniqueId({ length: 6 });
  const code = String(generate()).toUpperCase();

  await prisma.pools.create({
    data: {
      title,
      code,
    },
  });

  return res.status(201).json({ code });
});
