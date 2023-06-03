const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDb = require("./db/connect");
const authRouter = require("./routers/auth");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

//middleWares
app.use(express.json());
app.use(cors());
app.use("/api/v1", authRouter);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 6000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server is running on port: ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
