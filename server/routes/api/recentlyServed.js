const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // GEt the Token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // set token or become null
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// protected
// GET ALL Recently Served
router.get("/", authenticateToken, async (req, res) => {
  const recentlyServed = await loadRecentlyServedCollection();
  console.log("get all Recently Served");
  res.send(await recentlyServed.find({}).toArray());
});
// protected
// ADD Recently Served
router.post("/", authenticateToken, async (req, res) => {
  try {
    const recentlyServed = await loadRecentlyServedCollection();
    await recentlyServed.insertOne({
      queueID: req.body._id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.lastName,
      vaccineBrand: req.body.vaccineBrand,
      dose: req.body.dose,
      queueDate: req.body.date,
      date: new Date(),
    });
    console.log("post recently Served");
    res.status(201).json({
      msg: "Recently Served Successfully Created",
      recentlyServed: req.body,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// protected
// Delete Recently Served
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const recentlyServed = await loadRecentlyServedCollection();
    await recentlyServed.deleteOne({
      _id: new mongodb.ObjectId(req.params.id),
    });
    res.status(200).json({ msg: "Recently Served Successfully Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Connect to mongodb
async function loadRecentlyServedCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://dev-royet:123@cluster0.witrn.mongodb.net/queue_system_mobile?retryWrites=true&w=majority"
  );
  return client.db("queue_system_mobile").collection("recently_served");
}

module.exports = router;
