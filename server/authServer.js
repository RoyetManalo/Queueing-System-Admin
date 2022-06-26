require("dotenv").config();

const express = require("express");

const app = express();

app.post("/login", (req, res) => {
  // Authenticate User
  const username = req.body.username;
  const password = req.body.password;

  const user = { username: username, password: password };

  const accessToken = generateToken(user);
  res.json({ accessToken });
});

function generateToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

app.listen(3000);
