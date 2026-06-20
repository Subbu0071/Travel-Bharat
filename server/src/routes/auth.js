import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { store } from "../store/index.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await store.findAdmin(email);
    const isValid = admin && (await bcrypt.compare(password, admin.passwordHash));
    if (!isValid) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const token = jwt.sign({ id: admin.id || admin._id, email: admin.email, name: admin.name }, process.env.JWT_SECRET, {
      expiresIn: "8h"
    });

    return res.json({
      token,
      admin: { email: admin.email, name: admin.name }
    });
  } catch (error) {
    return next(error);
  }
});
