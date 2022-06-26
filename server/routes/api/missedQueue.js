const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", authenticateToken, async (req, res) => {
  const missedQueuePeople = await loadMissedQueueCollection();
  console.log("get all missed queue");
  res.send(await missedQueuePeople.find({}).toArray());
});

router.post("/", async (req, res) => {
  try {
    const missedQueue = await loadMissedQueueCollection();
    // make it insert many
    const data = req.body;
    const newData = data.map((person) => ({
      queueID: person._id,
      queueNumber: person.queueNumber,
      firstName: person.firstName,
      lastName: person.lastName,
      age: person.age,
      vaccineBrand: person.vaccineBrand,
      dose: person.dose,
      date: person.date,
    }));
    await missedQueue.insertMany(newData);
    console.log("post missed queue");
    res.status(201).json({
      msg: "missed queue Successfully Created",
      missedQueue: req.body,
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.delete("/multipleperson", authenticateToken, async (req, res) => {
  try {
    let usersDelete = [];
    const ids = req.body.ids;
    ids.forEach((id) => {
      usersDelete.push(new mongodb.ObjectId(id));
    });

    const missedQueue = await loadMissedQueueCollection();
    await missedQueue.deleteMany({ _id: { $in: usersDelete } });
    console.log("delete multiple missed Queue");
    res.status(200).json({ msg: "Multiple MIssed Queue Successfully Deleted" });
    // res.send(usersDelete);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  try {
    const queues = await loadMissedQueueCollection();
    await queues.deleteMany({});
    console.log("all Queue Deleted");
    res.status(200).json({ msg: "All Missed Queue Successfully Deleted" });
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
async function loadMissedQueueCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://dev-royet:123@cluster0.witrn.mongodb.net/queue_system_mobile?retryWrites=true&w=majority"
  );
  return client.db("queue_system_mobile").collection("missed_queue");
}

module.exports = router;
