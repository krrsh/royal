const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderDetailsSchema = new Schema(
  {
    orderNum: {
      type: Number,
      unique: true,
    },
    orderType: {
      type: String,
      enum: ["DineIn", "TakeAway"],
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(arr) => arr.length > 0, "Must have at least one item."],
    },
    totalItems: {
      type: Number,
      min: 1,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    cookingTime: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["OnGoing", "served"],
      default: "OnGoing",
    },

    tableNum: {
      type: String,
      default: null,
    },
    chefId: {
      type: Schema.Types.ObjectId,
      ref: "Chef",
    },
  },
  { timestamps: true }
);

orderDetailsSchema.set("toJSON", { virtuals: true });
orderDetailsSchema.set("toObject", { virtuals: true });

orderDetailsSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastOrder = await this.constructor
      .findOne({})
      .sort({ orderNum: -1 })
      .select("orderNum")
      .lean();
    this.orderNum = lastOrder ? lastOrder.orderNum + 1 : 1;
  }

  // If order is marked as served, update chef & table
  if (this.isModified("status") && this.status === "served") {
    const Chef = require("./chefModels");
    const Tables = require("./tablesModel");

    try {
      const chef = await Chef.findById(this.chefId);

      if (chef) {
        const updatedOrders = Math.max(0, chef.orders - 1);
        const updatedTimeRemaining = Math.max(0, chef.timeRemaining - this.cookingTime);
      
        await Chef.findByIdAndUpdate(this.chefId, {
          orders: updatedOrders,
          timeRemaining: updatedTimeRemaining,
        });
      }

      // Free table if DineIn
      if (this.orderType === "DineIn" && this.tableNum !== null) {
        await Tables.findOneAndUpdate(
          { tablenum: this.tableNum },
          { status: "available" }
        );
      }
    } catch (e) {
      console.error("Failed to update chef/table on order completion:", e);
    }
  }

  this.totalItems = this.items.reduce((sum, it) => sum + it.count, 0);
  next();
});

// ─── VIRTUAL: remainingCookingTime (minutes left) ──────────────────────────
orderDetailsSchema.virtual("remainingCookingTime").get(function () {
  if (!this.createdAt) return this.cookingTime;
  const elapsedMs = Date.now() - this.createdAt.getTime();
  const elapsedMins = Math.floor(elapsedMs / 60000);
  const remaining = this.cookingTime - elapsedMins;
  return remaining > 0 ? remaining : 0;
});

const OrderDetails = mongoose.model("OrderDetails", orderDetailsSchema);
module.exports = OrderDetails;
