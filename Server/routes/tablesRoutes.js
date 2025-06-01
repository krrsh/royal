const express = require("express");

const Tables = require("../models/tablesModel");

const router = express.Router();

//Get all tables
router.get("/", async (req, res) => {
  try {
    const tablesData = await Tables.find().sort({ createdAt: 1 });
    res.status(200).json(tablesData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Inserting a new table
router.post("/", async (req, res) => {
  try {
    const { tablenum, chairs, status } = req.body;

    // Basic validation:
    if (!tablenum || typeof chairs !== "number") {
      return res
        .status(400)
        .json({
          error: "Both `tablenum` (string) and `chairs` (number) are required.",
        });
    }

    // check for duplicates:
    const existing = await Tables.findOne({ tablenum });
    if (existing) {
      return res
        .status(409)
        .json({ error: `Table with tablenum "${tablenum}" already exists.` });
    }

    const newTable = new Tables({
      tablenum,
      chairs,
      status: status || "available",
    });
    await newTable.save();
    return res.status(201).json(newTable);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Deleting tables
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Tables.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "No table found with that ID." });
    }

    return res
      .status(200)
      .json({ message: "Table deleted successfully.", deleted });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
