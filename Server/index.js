require('dotenv').config();
const express = require("express");
const cors = require("cors");

const { startOrderScheduler } = require("./utils/orderScheduler");

const app = express();

//Port
const port = process.env.PORT || 4000;

//cors
app.use(cors());

//db connection
require("./db/connection");

//Require Routes
const foodItemsRoutes = require("./routes/foodItemRoutes");
const tablesRoutes = require("./routes/tablesRoutes");
const orderDetailsRoutes = require("./routes/orderDetailsRoutes");
const chefRoutes = require("./routes/chefRoutes");
const totaldataRoutes = require("./routes/totalDataRoutes");

//MiddleWares
app.use(express.json());
app.use("/images", express.static("./public/images"));

//Routes
app.use("/api/foodItems", foodItemsRoutes);
app.use("/api/tables", tablesRoutes);
app.use("/api/orderDetails", orderDetailsRoutes);
app.use("/api/chef", chefRoutes);
app.use("/api/totaldata", totaldataRoutes);

startOrderScheduler();

app.listen(port, () => {
  console.log(`Server is running at PORT : ${port}`);
});
