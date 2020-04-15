process.on("uncaughtException", (error) => {
  console.log("--------------UNCAUGHT EXCEPTION ERROR------------");
  console.log("\n", {
    status: "error",
    error: error,
  });
  process.exit(1);
});

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");

const app = require("./app");

dotenv.config({ path: "./config.env" });

const db = process.env.DB_CONN_STRING.replace(
  "<password>",
  process.env.DB_PASSWORD
);

if (process.env.NODE_ENV === "development") {
  console.log("MORGAN ENABLED");
  app.use(morgan("common"));
}

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DATABASE CONNECTION SUCCESSFUL");
  })
  .catch((err) => {
    console.log(err.message);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`LISTENING AT PORT ${port} . . .`);
});

process.on("unhandledRejection", (error) => {
  console.log("--------------UNHANDLED PROMISE REJECTION ERROR------------");
  console.log("\n", {
    status: "error",
    error: error,
  });
  process.exit(1);
});
