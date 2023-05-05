const express = require("express");
const app = express();
const ExpressError = require("./expressError");
const itemRoutes = require("./routes/items");

app.use(express.json());
app.use("/items", itemRoutes);

// 404 handler
app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

// general error handler
app.use((error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message;
  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
