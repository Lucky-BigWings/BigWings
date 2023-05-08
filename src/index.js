const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route.js");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.use('/', route);

mongoose.connect("mongodb+srv://luckybigwings:738xp7MiKEIJWrz8@cluster0.kbmybtj.mongodb.net/test", { useNewUrlParser: true })
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`App running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
