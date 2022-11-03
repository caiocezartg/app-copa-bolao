import express from "express";
import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";
import validate from "./middlewares/validateMiddleware";
import poolSchema from "./validations/poolValidation";

const app = express();
app.use(express.json());

const prisma = new PrismaClient({
  log: ["query"],
});

app.get("/pools/count", async (req, res) => {
  const count = await prisma.pools.count();

  return res.json({
    count,
  });
});

app.get("/users/count", async (req, res) => {
  const count = await prisma.user.count();

  return res.json({
    count,
  });
});

app.get("/guesses/count", async (req, res) => {
  const count = await prisma.guess.count();

  return res.json({
    count,
  });
});

app.post("/pools", validate(poolSchema), async (req, res) => {
  const title = req.body.title;
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

app.listen(3333, () => {
  console.log("Server running!");
});
