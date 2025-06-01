import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";
import TablesPage from "./pages/TablesPage/TablesPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import MenuPage from "./pages/MenuPage/MenuPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import { Provider } from "react-redux";
import { store } from "./Redux/Store.js";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
