// aZNCEhTrFAw5OGcp

const express = require("express");

const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
// eslint-disable-next-line no-unused-vars
const auth = require("./api/middleware/auth");
const userRoutes = require("./api/routes/user");
const loginRoute = require("./api/routes/login");
const branchRoute = require("./api/routes/branch");
const centerRoute = require("./api/routes/center");
const employeeRoute = require("./api/routes/employee");
const clientRoute = require("./api/routes/clients");
const loanRoute = require("./api/routes/loans");
const depositeRoute = require("./api/routes/deposit");
const psRoute = require("./api/routes/ps-route");

app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 1000000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});
app.set("env", "production");
app.use("/api", loginRoute);
app.use("/api/user", userRoutes);
app.use("/api/branches", branchRoute);
app.use("/api/centers", centerRoute);
app.use("/api/employees", employeeRoute);
app.use("/api/clients", clientRoute);
app.use("/api/loans", loanRoute);
app.use("/api/deposits", depositeRoute);
app.use("/api/pension-schemes", psRoute);

app.use((req, resp, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, resp) => {
  resp.status(error.status || 500);
  resp.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;
