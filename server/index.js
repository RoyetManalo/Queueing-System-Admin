const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/api/authentication");
app.use("/auth", authRoutes);

const statusRoutes = require("./routes/api/status");
app.use("/api/status", statusRoutes);

const queueRoutes = require("./routes/api/queue");
app.use("/api/queue", queueRoutes);

const missedQueueRoutes = require("./routes/api/missedQueue");
app.use("/api/missedqueue", missedQueueRoutes);

const vaccineRoutes = require("./routes/api/vaccine");
app.use("/api/vaccine", vaccineRoutes);

const recentlyServedRoutes = require("./routes/api/recentlyServed");
app.use("/api/recentlyserved", recentlyServedRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running in PORT:${PORT}`));
