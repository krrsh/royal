import React, { useEffect, useState } from "react";
import "./MenuItemCard.css";
import addBtn from "../../assets/plusBtn.svg";
import { useDispatch, useSelector } from "react-redux";
import { addItem, decrementItem } from "../../Redux/Slice";

const MenuItemCard = ({ name, price, imgUrl, id, category, cookingTime }) => {
  const dispatch = useDispatch();

  const cartItem = useSelector((state) =>
    state.fooditems.addedItems.find((item) => item.id === id)
  );

  const [count, setCount] = useState(cartItem ? cartItem.count : 0);

  useEffect(() => {
    setCount(cartItem ? cartItem.count : 0);
  }, [cartItem]);

  const handleIncrement = () => {
    dispatch(addItem({ id, name, price, imgUrl, category, cookingTime }));
  };

  const handleDecrement = () => {
    if (count > 0) {
      dispatch(decrementItem(id));
    }
  };

  return (
    <div className="fooditemCard">
      <div className="imageWrapper">
        <img
          className="foodImage"
          src={`http://localhost:4000${imgUrl}`}
          alt="foodImg"
        />
        <div className="imageGradient"></div>
      </div>
      <div className="foodNameContainer">
        <p className="foodName">{name}</p>
        <p className="foodPrice">&#8377; {price}</p>
        {count === 0 && (
          <img
            onClick={handleIncrement}
            className="addItemBtn"
            src={addBtn}
            alt="img"
          />
        )}
        {count > 0 && (
          <div className="orderedFoodCount">
            <p onClick={handleDecrement} className="minus">
              -
            </p>
            <p className="count">{count}</p>
            <p onClick={handleIncrement} className="plus">
              +
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
