import React, { useEffect, useState } from "react";
import closeBtn from "../../assets/Close.png";
import "./OrderedFoods.css";
import { useDispatch, useSelector } from "react-redux";
import { addItem, decrementItem, removeItem } from "../../Redux/Slice";

const OrderedFoods = ({ item }) => {
  const dispatch = useDispatch();

  const cartItem = useSelector((state) =>
    state.fooditems.addedItems.find((i) => i.id === item.id)
  );

  const [count, setCount] = useState(cartItem ? cartItem.count : 0);

  useEffect(() => {
    setCount(cartItem ? cartItem.count : 0);
  }, [cartItem]);

  const handleIncrement = () => {
    dispatch(
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        imgUrl: item.imgUrl,
        category: item.category,
        cookingTime: item.cookingTime,
      })
    );
  };

  const handleDecrement = () => {
    if (count > 0) {
      dispatch(decrementItem(item.id));
    }
  };

  return (
    <div className="orderedFoodConatiner">
      <img
        className="orderedPic"
        src={`http://localhost:4000${item.imgUrl}`}
        alt="Img"
      />
      <div className="orderdFoodDetails">
        <div>
          <p className="orderedFoodName">{item.name}</p>
          <p className="orderdFoodPrice">&#8377;{item.price}</p>
        </div>
        {item.category === "Pizza" && (
          <p className="inches" style={{ opacity: "50%" }}>
            14&quot;
          </p>
        )}
        <img
          onClick={() => dispatch(removeItem(item.id))}
          className="dltFoodBtn"
          src={closeBtn}
          alt="Img"
        />
        <div className="orderedFoodCount">
          <p onClick={handleDecrement} className="minus">
            -
          </p>
          <p className="count">{count}</p>
          <p onClick={handleIncrement} className="plus">
            +
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderedFoods;
