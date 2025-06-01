const mongoose = require("mongoose");

const tablesSchema = mongoose.Schema(
  {
    tablenum: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    chairs: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      default: "available",
    },
  },
  { timestamps: true }
);

const Tables = new mongoose.model("Tables", tablesSchema);

module.exports = Tables;
