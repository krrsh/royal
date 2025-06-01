const express = require("express");

const OrderDetails = require("../models/orderDetailsModel");
const Tables = require("../models/tablesModel");
const Chef = require("../models/chefModels");

const router = express.Router();

//Get all order details
router.get("/", async (req, res) => {
  try {
    const ordersData = await OrderDetails.find().sort({ createdAt: -1 });
    res.status(200).json(ordersData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Create new order
router.post("/", async (req, res) => {
  try {
    const {
      orderType,
      items,
      amountPaid,
      phone,
      cookingTime,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Must order at least one item." });
    }

    //If DineIn, assign next available table
    let assignedTable = null;
    if (orderType === "DineIn") {
      // Find the lowest-numbered table whose status is "available"
      const table = await Tables.findOne({ status: "available" }).sort({
        tablenum: 1,
      });
      if (!table) {
        return res
          .status(400)
          .json({ error: "No available tables for DineIn." });
      }
      assignedTable = table.tablenum;
      //// Mark that table as reserved
      table.status = "reserved";
      await table.save();
    }

    //“Chef assignment” logic: pick the chef with fewest orders, then lowest timeRemaining
    const chef = await Chef.findOne().sort({ orders: 1, timeRemaining: 1 });
    if (!chef) {
      return res
        .status(500)
        .json({ error: "No chef records found; cannot assign order." });
    }
    // increment chef counters
    chef.orders += 1;
    chef.timeRemaining += cookingTime;
    await chef.save();

    const newOrder = new OrderDetails({
      orderType,
      items,
      amountPaid,
      phone,
      cookingTime,
      chefId: chef._id,
      ...(orderType === "DineIn" && { tableNum: assignedTable }),
    });

    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (err) {
    console.error("Order creation failed:", err);
    return res
      .status(500)
      .json({ error: "Failed to create order", details: err });
  }
});

module.exports = router;
