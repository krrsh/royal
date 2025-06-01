const express = require("express");

const FoodItems = require("../models/foodItemsModel");

const router = express.Router();

//Get all records
router.get("/", async (req, res) => {
  try {
    const foodItemsData = await FoodItems.find({});
    res.status(200).json(foodItemsData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
