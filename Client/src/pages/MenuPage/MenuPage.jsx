import React, { useEffect, useState } from "react";
import "./MenuPage.css";
import searchIcon from "../../assets/search.png";
import burger from "../../assets/burger.svg";
import lightburger from "../../assets/burgerLight.svg";
import pizza from "../../assets/pizza.svg";
import lightpizza from "../../assets/pizzaLight.svg";
import drink from "../../assets/drink.svg";
import lightdrink from "../../assets/drinkLight.svg";
import fries from "../../assets/fries.svg";
import lightfries from "../../assets/friesLight.svg";
import veggies from "../../assets/veggies.svg";
import lightveggies from "../../assets/veggiesLight.svg";
import MenuItemCard from "../../components/MenuItemCard/MenuItemCard";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Burger");
  const [foodItems, setFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const Addeditems = useSelector((state) => state.fooditems.addedItems);

  //fetching menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/foodItems");
        setFoodItems(res.data);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };

    fetchData();
  }, []);

  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Greetings!");
    }
  }, []);

  return (
    <div className="menuPageContainer">
      <p style={{ color: "#231100", fontSize: "18px" }}>{greeting}</p>
      <p style={{ color: "#231100", fontSize: "14px" }}>
        Place your order here
      </p>

      <div className="searchMenuContainer">
        <input
          className="searchMenuInput"
          type="text"
          placeholder="Search by food name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <img className="searchMenuBtn" src={searchIcon} alt="searchIcon" />
      </div>

      <div className="categoryContainer">
        <div
          onClick={() => setSelectedCategory("Burger")}
          style={{
            backgroundColor: selectedCategory === "Burger" && "#616161",
            boxShadow:
              selectedCategory === "Burger" &&
              "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="categoryCard"
        >
          {selectedCategory === "Burger" ? (
            <img src={lightburger} alt="img" />
          ) : (
            <img src={burger} alt="img" />
          )}
          <p
            style={{
              color: selectedCategory === "Burger" ? "#FFF" : "#616161",
            }}
          >
            Burger
          </p>
        </div>

        <div
          onClick={() => setSelectedCategory("Pizza")}
          style={{
            backgroundColor: selectedCategory === "Pizza" && "#616161",
            boxShadow:
              selectedCategory === "Pizza" && "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="categoryCard"
        >
          {selectedCategory === "Pizza" ? (
            <img src={lightpizza} alt="img" />
          ) : (
            <img src={pizza} alt="img" />
          )}
          <p
            style={{ color: selectedCategory === "Pizza" ? "#FFF" : "#616161" }}
          >
            Pizza
          </p>
        </div>

        <div
          onClick={() => setSelectedCategory("Drink")}
          style={{
            backgroundColor: selectedCategory === "Drink" && "#616161",
            boxShadow:
              selectedCategory === "Drink" && "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="categoryCard"
        >
          {selectedCategory === "Drink" ? (
            <img src={lightdrink} alt="img" />
          ) : (
            <img src={drink} alt="img" />
          )}
          <p
            style={{ color: selectedCategory === "Drink" ? "#FFF" : "#616161" }}
          >
            Drink
          </p>
        </div>

        <div
          onClick={() => setSelectedCategory("Fries")}
          style={{
            backgroundColor: selectedCategory === "Fries" && "#616161",
            boxShadow:
              selectedCategory === "Fries" && "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="categoryCard"
        >
          {selectedCategory === "Fries" ? (
            <img src={lightfries} alt="img" />
          ) : (
            <img src={fries} alt="img" />
          )}
          <p
            style={{ color: selectedCategory === "Fries" ? "#FFF" : "#616161" }}
          >
            Fries
          </p>
        </div>

        <div
          onClick={() => setSelectedCategory("Veggies")}
          style={{
            backgroundColor: selectedCategory === "Veggies" && "#616161",
            boxShadow:
              selectedCategory === "Veggies" &&
              "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="categoryCard"
        >
          {selectedCategory === "Veggies" ? (
            <img src={lightveggies} alt="img" />
          ) : (
            <img src={veggies} alt="img" />
          )}
          <p
            style={{
              color: selectedCategory === "Veggies" ? "#FFF" : "#616161",
            }}
          >
            Veggies
          </p>
        </div>
      </div>

      <p className="selectedCategoryHeading">{selectedCategory}</p>

      <div className="menuItemsContainer">
        <div className="fooditemCardContainer">
          {foodItems
            .filter(
              (item) =>
                item.category === selectedCategory &&
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => {
              return (
                <MenuItemCard
                  key={item._id}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  imgUrl={item.imgUrl}
                  category={item.category}
                  cookingTime={item.cookingTime}
                />
              );
            })}
        </div>

        {Addeditems.length > 0 && (
          <button onClick={() => navigate("/checkout")} className="menuNextBtn">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
