import React, { useEffect, useState } from "react";
import "./CheckoutPage.css";
import searchIcon from "../../assets/search.png";
import closeOverlay from "../../assets/CloseOverlay.png";
import address from "../../assets/address.png";
import deliveryTime from "../../assets/delTime.png";
import SwipeToOrder from "../../components/SwipetoOrder/SwipeToOrder";
import { useDispatch, useSelector } from "react-redux";
import OrderedFoods from "../../components/OrderedFoods/OrderedFoods";
import {
  setAddress,
  setAmountPaid,
  setCookingTime,
  setItems,
  setOrderdType,
  setPhone,
  setUsername,
} from "../../Redux/Slice";

const CheckoutPage = () => {
  const dispatch = useDispatch();

  const [orderType, setOrderType] = useState("DineIn");
  const [instructions, setInstructions] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [detailsrequired, setDetailsrequired] = useState(true);
  const [addressRequired, setAddressRequired] = useState(true);
  const [cookingInstructions, setCookingInstructions] = useState("");
  const [instructionSaved, setInstructionSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const submitDetails = () => {
    const isNameEmpty = userDetails.name.trim() === "";
    const isPhoneEmpty = userDetails.phone.trim() === "";

    setDetailsrequired(isNameEmpty || isPhoneEmpty);

    if (!isPhoneEmpty) {
      dispatch(setPhone(userDetails.phone));
    }
    if (!isNameEmpty) {
      dispatch(setUsername(userDetails.name));
    }
  };

  const submitAddress = () => {
    const isAddressEmpty = userDetails.address.trim() === "";

    if (orderType === "TakeAway") {
      setAddressRequired(isAddressEmpty);
      dispatch(setAddress(userDetails.address));
    } else {
      setAddressRequired(false);
    }
  };

  const addedItems = useSelector((state) => state.fooditems.addedItems);
  const totalPrice = addedItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const totalCookingTime = addedItems.reduce(
    (total, item) => total + item.cookingTime * item.count,
    0
  );
  const grandTotal = totalPrice + 5 + deliveryCharge;

  useEffect(() => {
    dispatch(setItems(addedItems.map(({ name, count }) => ({ name, count }))));
    dispatch(setCookingTime(totalCookingTime));
    dispatch(setAmountPaid(grandTotal));
  }, [addedItems, totalCookingTime, grandTotal, dispatch]);

  useEffect(() => {
    if (orderType === "TakeAway") {
      setDeliveryCharge(50);
    } else {
      setDeliveryCharge(0);
    }
    dispatch(setOrderdType(orderType));
  }, [orderType]);

  const order = useSelector((state) => state.fooditems.orderData);

  console.log("Orderd : ", order);

  return (
    <div className="checkoutPageContainer">
      <p style={{ color: "#231100", fontSize: "18px", padding: "0 10px" }}>
        Good Evening
      </p>
      <p style={{ color: "#231100", fontSize: "14px", padding: "0 10px" }}>
        Place your order here
      </p>

      <div className="searchMenuContainer">
        <input className="searchMenuInput" type="text" placeholder="Search" />
        <img className="searchMenuBtn" src={searchIcon} alt="searchIcon" />
      </div>

      {addedItems.map((item) => {
        return <OrderedFoods key={item.id} item={item} />;
      })}

      <div>
        {instructionSaved ? (
          <p style={{ fontSize: "10px", color: "#555", padding: "0 10px" }}>
            Instruction: {cookingInstructions}
          </p>
        ) : (
          <p onClick={() => setInstructions(true)} className="instructions">
            Add cooking instructions (optional)
          </p>
        )}
      </div>

      <div className="orderTypeBtnContainer">
        <button
          onClick={() => setOrderType("DineIn")}
          style={{
            backgroundColor: orderType === "DineIn" ? "#FFFFFF" : "#E4E4E4",
          }}
          className="dineInOpt"
        >
          Dine In
        </button>
        <button
          onClick={() => setOrderType("TakeAway")}
          style={{
            backgroundColor: orderType === "TakeAway" ? "#FFFFFF" : "#E4E4E4",
          }}
          className="takeAwayOpt"
        >
          Take Away
        </button>
      </div>

      <div className="totalPriceContainer">
        <div className="pricedetails">
          <p>Item Total</p>
          <p className="priceInts">&#8377;{totalPrice}.00</p>
        </div>
        {orderType === "TakeAway" && (
          <div className="pricedetails">
            <p className="deliveryText">Delivery Charge</p>
            <p className="priceInts">&#8377;50</p>
          </div>
        )}
        <div className="pricedetails">
          <p>Taxes</p>
          <p className="priceInts">&#8377;5.00</p>
        </div>
        <div className="grandpricedetails">
          <p style={{ fontSize: "18px" }}>Grand Total</p>
          <p className="priceInts">&#8377;{grandTotal}.00</p>
        </div>
      </div>

      <hr />

      <div className="yourDetailsContainer">
        <p style={{ fontSize: "14px", fontWeight: "500" }}>Your details</p>
        {detailsrequired && (
          <div className="userDetailsInput">
            <input
              name="name"
              value={userDetails.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter your Name"
            />
            <input
              name="phone"
              value={userDetails.phone}
              onChange={handleChange}
              type="text"
              placeholder="Enter your Contact No."
            />
            <button onClick={submitDetails} className="detaislSaveBtn">
              Save
            </button>
          </div>
        )}
        {!detailsrequired && (
          <p style={{ fontSize: "10px" }}>
            {userDetails.name}, {userDetails.phone}
          </p>
        )}
      </div>

      <hr />

      <div className="addressDetailsContainer">
        {orderType === "TakeAway" && (
          <div className="yourAddressContainer">
            <p style={{ fontSize: "14px", fontWeight: "500" }}>Your address</p>

            {addressRequired ? (
              <div className="addressInput">
                <input
                  name="address"
                  value={userDetails.address}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your Address"
                />
                <button onClick={submitAddress} className="addressSaveBtn">
                  Save Address
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img src={address} alt="address icon" />
                <p
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "10px",
                  }}
                >
                  Delivery at - {userDetails.address}
                </p>
              </div>
            )}
          </div>
        )}
        <div>
          <img src={deliveryTime} alt="Img" />
          <p>
            Delivery in{" "}
            <span style={{ fontWeight: "bold" }}>{totalCookingTime} mins</span>
          </p>
        </div>
      </div>

      <hr style={{ height: "2px" }} />

      <div className="swipeSection">
        <SwipeToOrder />
      </div>

      {instructions && (
        <div className="InstructionsOverlay">
          <img
            className="overlayCloseBtn"
            onClick={() => setInstructions(false)}
            src={closeOverlay}
            alt="closeBtn"
          />
          <div className="instructionBoxContainer">
            <p
              style={{ fontSize: "20px", fontWeight: "500", margin: "0 20px" }}
            >
              Add Cooking instructions
            </p>
            <textarea
              className="instctionsTextarea"
              value={cookingInstructions}
              onChange={(e) => setCookingInstructions(e.target.value)}
            />
            <p className="instructionsTexts">
              The restaurant will try its best to follow your request. However,
              refunds or cancellations in this regard won’t be possible
            </p>
            <div className="instructionActions">
              <button onClick={() => setInstructions(false)}>Cancel</button>
              <button
                onClick={() => {
                  if (cookingInstructions.trim() !== "") {
                    setInstructionSaved(true);
                  }
                  setInstructions(false);
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
