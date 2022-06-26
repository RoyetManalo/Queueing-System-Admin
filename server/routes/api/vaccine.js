const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();
const jwt = require("jsonwebtoken");

// protected
// GET ALL VACCINE
router.get("/", authenticateToken, async (req, res) => {
  const vaccines = await loadVaccineCollection();
  console.log("get all vaccines");
  res.send(await vaccines.find({}).toArray());
});
// protected
// Get single Vaccine
router.get("/:id", authenticateToken, async (req, res) => {
  const vaccines = await loadVaccineCollection();
  res.send(
    await vaccines.findOne({ _id: new mongodb.ObjectId(req.params.id) })
  );
});

router.post("/recent", authenticateToken, async (req, res) => {
  const vaccines = await loadVaccineCollection();
  res.send(await vaccines.find().sort({ $natural: -1 }).limit(1).toArray());
});
// get recently added vaccine

// protected
// ADD Vaccine
router.post("/", authenticateToken, async (req, res) => {
  try {
    const vaccines = await loadVaccineCollection();
    await vaccines.insertOne({
      vaccineBrand: req.body.vaccineBrand,
      vials: req.body.vials,
    });
    res.status(201).json({ vaccine: req.body }); // i remove the message
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});
// protected
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const vaccines = await loadVaccineCollection();
    await vaccines.updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      {
        $set: {
          vials: req.body.vials,
        },
      }
    );
    res.status(201).json({ vaccine: req.body });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});
// protected
// Delete Queue
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const vaccines = await loadVaccineCollection();
    await vaccines.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    res.status(200).json({ msg: "Vaccine Successfully Deleted" });
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
async function loadVaccineCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://dev-royet:123@cluster0.witrn.mongodb.net/queue_system_mobile?retryWrites=true&w=majority"
  );
  return client.db("queue_system_mobile").collection("vaccine");
}

module.exports = router;
