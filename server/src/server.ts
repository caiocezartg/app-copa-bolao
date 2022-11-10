import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { router as poolRouter } from "../src/routes/pool";
import { router as guessRouter } from "../src/routes/guess";
import { router as userRouter } from "../src/routes/user";
import { router as authRouter } from "../src/routes/auth";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/pools", poolRouter);
app.use("/guesses", guessRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);

app.listen(3333, () => {
  console.log("Server running!");
});
