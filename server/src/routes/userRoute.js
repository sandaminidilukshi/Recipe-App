import express from "express";
import { userModel } from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username });
  if (user) {
    res.json({ messsage: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    username,
    password: hashedPassword,
  });

  newUser.save();

  res.json({ message: "User created successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username });

  if (!user) {
    return res.json({ message: "User doesn't exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "Password incorrect!" });
  }

  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id });
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
