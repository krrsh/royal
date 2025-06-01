const express = require("express");

const Chef = require("../models/chefModels");

const router = express.Router();

//Get chef details
router.get("/", async (req, res) => {
  try {
    const chefData = await Chef.find();
    res.status(200).json(chefData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
