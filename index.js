const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const morgan = require("morgan");

const cors = require("cors");

app.get("/", (req, res) => {
  res.send("welcome");
});

const membersRoutes = require("./api/routes/member");
const adminRoutes = require("./api/routes/admin");

const port = process.env.PORT || 7000;

// "mongodb://localhost:27017/yagi"

mongoose
  .connect(
    "mongodb+srv://kenny:Aspirine1@yagi-i6nqc.mongodb.net/test?retryWrites=true&w=majority" ||
      "mongodb://localhost:27017/yagi",

    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch((err) => console.error(err));
mongoose.Promise = global.Promise;
mongoose.connection
  .on("connected", () => {
    console.log("mongoose connection open");
  })
  .on("error", (error) => {
    console.log(`connection error ${error.message}`);
  });

//Middleware to prevent corse error
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());

app.listen(port, () => {
  console.log("listening on port: " + port);
});

app.use("/register", membersRoutes);
app.use("/admin", adminRoutes);

module.exports = app;
