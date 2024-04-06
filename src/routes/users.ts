import express from "express";
import bcrypt from "bcrypt";
import User from "../../model/user";
import { toNewUser } from "../utils";

const router = express.Router();

router.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

router.post("/", async (req, res) => {
  const newUserEntry = toNewUser(req.body);
  const {username, name, password} = newUserEntry;
    
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const addedUser = new User({
    username,
    name,
    passwordHash
  }
  );

  await addedUser.save();

  res.status(201).json(addedUser);
});

export default router;