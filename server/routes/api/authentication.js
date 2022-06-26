require("dotenv").config();

const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get Token
router.post("/token", (req, res) => {
  const ip = req.ip;
  const randomHash1 = require("crypto").randomBytes(12).toString("hex");
  const randomHash2 = require("crypto").randomBytes(12).toString("hex");
  const user = { user: `${randomHash1}-${ip}-${randomHash2}` };

  const accessToken = jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET);
  res.json(accessToken);
});

router.post("/login", async (req, res) => {
  const response = await loadAdminCollection();
  const data = await response.find({}).toArray();
  const user = data.find((admin) => admin.username === req.body.username);

  if (user === undefined || user === null)
    res.json({ status: "ERROR", error: "Cannot Find Username" });
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = generateToken(user);
      res.json({ status: "OK", token: token });
    } else {
      res.json({ status: "ERROR", error: "Wrong Username/Password" });
    }
  } catch {
    res.status(500).send();
  }
});

router.post("/changecredentials", async (req, res) => {
  try {
    const username = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: username, paswword: hashedPassword };
    const data = await loadAdminCollection();
    await data.deleteMany({});
    await data.insertOne({
      username: username,
      password: hashedPassword,
    });
    res.status(201).json({ msg: "Credentials Successfully Changed" });
    // put the user in the database
  } catch (error) {
    res.status(500).json(error);
  }
});

// Encrypt the admin info
router.post("/", async (req, res) => {
  try {
    const hashedUsername = await bcrypt.hash(req.body.username, 10);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: hashedUsername, paswword: hashedPassword };
    const data = await loadAdminCollection();
    await data.insertOne(user);
    res.status(201).json({ user });
    // put the user in the database
  } catch (error) {
    res.status(500).json(error);
  }
});

// Change username and password
// router.put("/changeadmininfo", async (req, res) => {
//   const queues = await loadAdminCollection();
//   res.send(await queues.find({}).limit(limit).toArray());
//   console.log(`Get ${limit} queues only`);
// });

// can only access if you are login
router.patch("/changeadmininfo", async (req, res) => {
  try {
    const status = await loadAdminCollection();
    await status.updateOne(
      { username: req.body.username },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
        },
      }
    );
    res.status(201).json({ msg: "Info Successfully Updated", info: req.body });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

function generateToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

// function generateToken(user) {
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
// }
// Connect to mongodb
async function loadAdminCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://dev-royet:123@cluster0.witrn.mongodb.net/queue_system_mobile?retryWrites=true&w=majority"
  );
  return client.db("queue_system_mobile").collection("admin");
}

module.exports = router;
