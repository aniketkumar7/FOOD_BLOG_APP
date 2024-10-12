const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const { connect } = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: "https://food-blog-app-sooty.vercel.app/",
  })
);
app.use(express.static("public"));

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

connect(process.env.CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
