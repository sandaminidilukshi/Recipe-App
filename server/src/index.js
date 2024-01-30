import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/userRoute.js";
import { RecipeRouter } from "./routes/recipeRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://san:1234@cluster0.qdroxu7.mongodb.net/recipes");

app.listen(3001, () => {
  console.log("Server Started");
});

app.use("/auth", userRouter);
app.use("/recipe", RecipeRouter);
