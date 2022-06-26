const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const jwt = require("jsonwebtoken");

// protected
// GET QUEUE STATUS
router.get("/", async (req, res) => {
  const status = await loadStatus();
  console.log("get queue status");
  res.send(await status.find({}).toArray());
});
// protected
router.patch("/:id", async (req, res) => {
  try {
    const status = await loadStatus();
    await status.updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      {
        $set: {
          status: req.body.status,
        },
      }
    );
    res
      .status(201)
      .json({ msg: "Status Successfully Updated", status: req.body });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// Connect to mongodb
async function loadStatus() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://dev-royet:123@cluster0.witrn.mongodb.net/queue_system_mobile?retryWrites=true&w=majority"
  );
  return client.db("queue_system_mobile").collection("status");
}

module.exports = router;
