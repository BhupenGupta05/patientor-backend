import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../model/user";

const router = express.Router();

interface UserForToken {
  username: string;
  id: string; // Assuming User.id is a string
}

router.post("/", async (req, res) => {
  const {username, password} = req.body;

  const user = await User.findOne({username});
    

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password"
    });
  }

  const userForToken: UserForToken = {
    username: user.username,
    id: user.id,
  };

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET is not defined" });
  }

  const token = jwt.sign(userForToken, process.env.JWT_SECRET);

  return res.status(200).send({ token, username: user.username, name: user.name });
});

export default router;
