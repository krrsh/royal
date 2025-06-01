const mongoose = require("mongoose");

const foodItemsSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
  },
  imgUrl: {
    type: String,
  },
  cookingTime: {
    type: Number,
  },
  category: {
    type: String,
    enum: ["Pizza", "Burger", "Drinks", "Fries", "Veggies"],
  },
});

const FoodItems = new mongoose.model("FoodItems", foodItemsSchema);

module.exports = FoodItems;
