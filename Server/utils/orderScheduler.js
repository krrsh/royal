// const cron = require("node-cron");
// const OrderDetails = require("../models/orderDetailsModel");
// const Chef = require("../models/chefModels");
// const Tables = require("../models/tablesModel");

// async function checkAndServeOrders() {
//   const now = new Date();

//   try {
//     // Find orders where status is still “OnGoing” but (createdAt + cookingTime) ≤ now
//     // You can use MongoDB’s $expr to compare createdAt + (cookingTime * 60000) to current date.
//     const dueOrders = await OrderDetails.find({
//       status: "OnGoing",
//       $expr: {
//         $lte: [
//           { $add: ["$createdAt", { $multiply: ["$cookingTime", 60000] }] },
//           now,
//         ],
//       },
//     });

//     if (dueOrders.length === 0) {
//       return; // nothing to do this minute
//     }

//     //For each due order, mark served, update chef, free table
//     for (const order of dueOrders) {
//       // a) Update order status
//       order.status = "served";
//       await order.save();

//       // Decrement chef’s counters
//       if (order.chefId) {
//         await Chef.findByIdAndUpdate(order.chefId, {
//           $inc: { orders: -1, timeRemaining: -order.cookingTime },
//         });
//       }

//       // If DineIn, free the table
//       if (order.orderType === "DineIn" && order.tableNum) {
//         await Tables.findOneAndUpdate(
//           { tablenum: order.tableNum },
//           { status: "available" }
//         );
//       }
//     }
//   } catch (err) {
//     console.error("Error in order scheduler:", err);
//   }
// }

// function startOrderScheduler() {
//   cron.schedule("* * * * *", () => {
//     checkAndServeOrders();
//   });
// }

// module.exports = { startOrderScheduler };






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
      // if (order.chefId) {
      //   await Chef.findByIdAndUpdate(
      //     order.chefId,
      //     [
      //       {
      //         $set: {
      //           orders: {
      //             $max: [0, { $subtract: ["$orders", 1] }],
      //           },
      //           timeRemaining: {
      //             $max: [0, { $subtract: ["$timeRemaining", order.cookingTime] }],
      //           },
      //         },
      //       },
      //     ]
      //   );
      // }

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

