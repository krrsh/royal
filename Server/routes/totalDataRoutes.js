const express = require("express");

const OrderDetails = require("../models/orderDetailsModel");

const router = express.Router();

function getTimeBounds() {
  const now = new Date();

  // Daily
  // Start of Today at 00:00:00.000
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  // End of Today at 23:59:59.999
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  // Weekly
  // Start of this week (Sunday 00:00:00.000)
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  // End of this week (Saturday 23:59:59.999)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Monthly
  // Start of this month (1st day 00:00:00.000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  // End of this month (last day 23:59:59.999)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  // Yearly
  // Start of this year (Jan 1, 00:00:00.000)
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  startOfYear.setHours(0, 0, 0, 0);

  // End of this year (Dec 31, 23:59:59.999)
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  endOfYear.setHours(23, 59, 59, 999);

  return {
    startOfDay,
    endOfDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
  };
}

// Get total revenue from all orders
router.get("/revenue", async (req, res) => {
  try {
    const result = await OrderDetails.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amountPaid" },
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;
    res.status(200).json({ totalRevenue });
  } catch (err) {
    res.status(500).json({
      error: "Failed to calculate total revenue",
      details: err.message,
    });
  }
});

//Get total clients
router.get("/clients", async (req, res) => {
  try {
    const uniqueClients = await OrderDetails.distinct("phone");
    const totalClients = uniqueClients.length;

    res.status(200).json({ totalClients });
  } catch (err) {
    res.status(500).json({
      error: "Failed to calculate total clients",
      details: err.message,
    });
  }
});

//Get total orders
router.get("/orders", async (req, res) => {
  try {
    const totalOrders = await OrderDetails.countDocuments();
    res.status(200).json({ totalOrders });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to count orders", details: err.message });
  }
});

// 1) Served orders stats (Daily, Weekly, Monthly, Yearly)
router.get("/served", async (req, res) => {
  try {
    const {
      startOfDay,
      endOfDay,
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = getTimeBounds();

    const [countDay, countWeek, countMonth, countYear] = await Promise.all([
      OrderDetails.countDocuments({
        status: "served",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }),
      OrderDetails.countDocuments({
        status: "served",
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
      }),
      OrderDetails.countDocuments({
        status: "served",
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      OrderDetails.countDocuments({
        status: "served",
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      }),
    ]);

    return res.status(200).json({
      daily: countDay,
      weekly: countWeek,
      monthly: countMonth,
      yearly: countYear,
    });
  } catch (err) {
    console.error("Error fetching served stats:", err);
    return res
      .status(500)
      .json({ error: "Failed to get served stats", details: err.message });
  }
});

// 2) DineIn orders stats (Daily, Weekly, Monthly, Yearly)
router.get("/dinein", async (req, res) => {
  try {
    const {
      startOfDay,
      endOfDay,
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = getTimeBounds();

    const [countDay, countWeek, countMonth, countYear] = await Promise.all([
      OrderDetails.countDocuments({
        orderType: "DineIn",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }),
      OrderDetails.countDocuments({
        orderType: "DineIn",
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
      }),
      OrderDetails.countDocuments({
        orderType: "DineIn",
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      OrderDetails.countDocuments({
        orderType: "DineIn",
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      }),
    ]);

    return res.status(200).json({
      daily: countDay,
      weekly: countWeek,
      monthly: countMonth,
      yearly: countYear,
    });
  } catch (err) {
    console.error("Error fetching DineIn stats:", err);
    return res
      .status(500)
      .json({ error: "Failed to get DineIn stats", details: err.message });
  }
});

// 3) TakeAway orders stats (Daily, Weekly, Monthly, Yearly)
router.get("/takeaway", async (req, res) => {
  try {
    const {
      startOfDay,
      endOfDay,
      startOfWeek,
      endOfWeek,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = getTimeBounds();

    const [countDay, countWeek, countMonth, countYear] = await Promise.all([
      OrderDetails.countDocuments({
        orderType: "TakeAway",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }),
      OrderDetails.countDocuments({
        orderType: "TakeAway",
        createdAt: { $gte: startOfWeek, $lte: endOfWeek },
      }),
      OrderDetails.countDocuments({
        orderType: "TakeAway",
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      }),
      OrderDetails.countDocuments({
        orderType: "TakeAway",
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      }),
    ]);

    return res.status(200).json({
      daily: countDay,
      weekly: countWeek,
      monthly: countMonth,
      yearly: countYear,
    });
  } catch (err) {
    console.error("Error fetching TakeAway stats:", err);
    return res
      .status(500)
      .json({ error: "Failed to get TakeAway stats", details: err.message });
  }
});

// GET: Revenue data for charting (createdAt + amountPaid as revenue)
router.get("/graph-revenue", async (req, res) => {
  try {
    const orders = await OrderDetails.find({}, { createdAt: 1, amountPaid: 1 })
      .sort({ createdAt: 1 }) // sort oldest to newest
      .lean(); // make it plain JS objects

    const chartData = orders.map((order) => ({
      createdAt: order.createdAt,
      revenue: order.amountPaid || 0,
    }));

    res.status(200).json(chartData);
  } catch (err) {
    console.error("Error fetching chart revenue data:", err.message);
    res.status(500).json({ error: "Failed to fetch chart revenue data" });
  }
});

module.exports = router;
