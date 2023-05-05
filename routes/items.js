const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", (req, res, next) => {
  try {
    return res.json({ items });
  } catch (e) {
    return next(e);
  }
});

router.post("/", (req, res, next) => {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    let newItem = req.body;
    items.push(newItem);
    return res.json({ items });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", (req, res, next) => {
  try {
    let item = items.find((item) => item.name === req.params.name);
    if (!item) throw new ExpressError("Item not found", 404);
    return res.json({ item });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", (req, res, next) => {
  try {
    let item = items.find((item) => item.name === req.params.name);
    if (!item) throw new ExpressError("Item not found", 404);
    item.name = req.body.name;
    item.price = req.body.price;
    return res.json({ item });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:name", (req, res, next) => {
  const foundItem = items.findIndex((item) => item.name === req.params.name);
  if (foundItem === -1) throw new ExpressError("Item not found", 404);
  items.splice(foundItem, 1);
  return res.json({ message: "Deleted" });
});

module.exports = router;
