const cron = require("node-cron");
const OrderDetails = require("../models/orderDetailsModel");
const Chef = require("../models/chefModels");
const Tables = require("../models/tablesModel");

async function checkAndServeOrders() {
  const now = new Date();

  try {
    // Find orders where status is still “OnGoing” but (createdAt + cookingTime) ≤ now
    const dueOrders = await OrderDetails.find({
      status: "OnGoing",
      $expr: {
        $lte: [
          { $add: ["$createdAt", { $multiply: ["$cookingTime", 60000] }] },
          now,
        ],
      },
    });

    if (dueOrders.length === 0) return;

    for (const order of dueOrders) {
      // a) Update order status
      order.status = "served";
      await order.save();

      // b) Decrement chef's counters safely
      if (order.chefId) {
        await Chef.findByIdAndUpdate(
          order.chefId,
          [
            {
              $set: {
                orders: {
                  $max: [0, { $subtract: ["$orders", 1] }],
                },
                timeRemaining: {
                  $max: [0, { $subtract: ["$timeRemaining", order.cookingTime] }],
                },
              },
            },
          ]
        );
      }

      // c) Free the table if DineIn
      if (order.orderType === "DineIn" && order.tableNum) {
        await Tables.findOneAndUpdate(
          { tablenum: order.tableNum },
          { status: "available" }
        );
      }
    }
  } catch (err) {
    console.error("Error in order scheduler:", err);
  }
}

function startOrderScheduler() {
  cron.schedule("* * * * *", () => {
    checkAndServeOrders();
  });
}

module.exports = { startOrderScheduler };

