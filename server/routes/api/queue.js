const express = require("express");
const mongodb = require("mongodb");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const { consumers } = require("stream");
const jwt = require("jsonwebtoken");

router.delete("/multipleperson", authenticateToken, async (req, res) => {
  try {
    let usersDelete = [];
    const ids = req.body.ids;
    ids.forEach((id) => {
      usersDelete.push(new mongodb.ObjectId(id));
    });

    const queues = await loadQueueCollection();
    await queues.deleteMany({ _id: { $in: usersDelete } });
    console.log("delete multiple Queue");
    res.status(200).json({ msg: "Multiple Queue Successfully Deleted" });
    // res.send(usersDelete);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.post("/multipleperson", authenticateToken, async (req, res) => {
  try {
    const queues = await loadQueueCollection();
    // make it insert many
    const data = req.body;
    const newData = data.map((person) => ({
      _id: new mongodb.ObjectId(person.queueID),
      queueNumber: person.queueNumber,
      firstName: person.firstName,
      lastName: person.lastName,
      age: person.age,
      vaccineBrand: person.vaccineBrand,
      dose: person.dose,
      date: person.date,
    }));
    await queues.insertMany(newData);
    console.log("post missed queue");
    res.status(201).json({
      msg: "multiplequeue Successfully Created",
      multipleQueue: req.body,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// protected
// GET ALL QUEUE
router.get("/", authenticateToken, async (req, res) => {
  const queues = await loadQueueCollection();
  console.log("get all queue");
  res.send(await queues.find({}).toArray());
});

// protected
// Get Limited Queue
router.get("/_limit=:limit", authenticateToken, async (req, res) => {
  const limit = parseInt(req.params.limit);
  const queues = await loadQueueCollection();
  res.send(await queues.find({}).limit(limit).toArray());
  console.log(`Get ${limit} queues only`);
});

// protected
// GET LATEST QUEUE
router.get("/latest", authenticateToken, async (req, res) => {
  const queues = await loadQueueCollection();
  res.send(await queues.find({}).sort({ queueNumber: -1 }).limit(1).toArray());
  console.log("get latest queue");
});

// protected
// Delete Queue
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const queues = await loadQueueCollection();
    await queues.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    console.log("delete Queue");
    res.status(200).json({ msg: "Queue Successfully Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

// protected
// Delete All QUeue
router.delete("/", authenticateToken, async (req, res) => {
  try {
    const queues = await loadQueueCollection();
    await queues.deleteMany({});
    console.log("all Queue Deleted");
    res.status(200).json({ msg: "All Queue Successfully Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

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

// Connect to mongodb
async function loadQueueCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://dev-royet:123@cluster0.witrn.mongodb.net/queue_system_mobile?retryWrites=true&w=majority"
  );
  return client.db("queue_system_mobile").collection("queue_info");
}

module.exports = router;
