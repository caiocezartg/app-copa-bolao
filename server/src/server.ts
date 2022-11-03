import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient({
  log: ["query"],
});

app.get("/pools/count", async (req, res) => {
  const pools = await prisma.pools.count();

  res.json({
    count: pools,
  });
});

app.listen(3333, () => {
  console.log("Server running!");
});
