require("dotenv").config();
require("express-async-errors");

//extra security package
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();

//connect DB
const connectDB = require("./db/connect");

const authenticateUser = require("./middleware/authentication");

//routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="./index.html">Documentation</a>');
});
app.use(express.static("public"));

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 60 * 1000, //1 minutes
    max: 60, //limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
