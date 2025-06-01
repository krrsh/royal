import React, { useRef, useState } from "react";
import "./SwipetoOrder.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import arr from "../../assets/swipeArrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, setOrderdData } from "../../Redux/Slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SwipeToOrder = () => {
  const order = useSelector((state) => state.fooditems.orderData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sliderRef = useRef(null);
  const [isSwiped, setIsSwiped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handleMove = async (clientX) => {
    const sliderWidth = sliderRef.current.offsetWidth;
    const handleWidth = 60;
    const padding = 15;
    const maxRight = sliderWidth - handleWidth - padding;
    const offsetLeft = sliderRef.current.getBoundingClientRect().left;

    const newX = Math.min(clientX - offsetLeft, maxRight);

    if (
      !order.username?.trim() ||
      !order.phone?.trim() ||
      (order.orderType === "TakeAway" && !order.address?.trim())
    ) {
      toast.error("Please enter all required details!", {
        position: "bottom-center",
        autoClose: 3000,
      });
      setDragX(0);
      return;
    }

    if (newX >= maxRight && !isSwiped) {
      //If there's no table and this is a DineIn order, abort:
      if (order.orderType === "DineIn") {
        try {
          const res = await axios.get("https://royal-xy66.onrender.com/api/tables");
          const tablesList = res.data;
          const availableTables = tablesList.filter(
            (table) => table.status === "available"
          );
          if (availableTables.length === 0 || tablesList.length === 0) {
            toast.error("No tables available!", {
              position: "bottom-center",
              autoClose: 2000,
            });
            // Reset handle back to start
            setDragX(0);
            setTimeout(() => {
              navigate("/menu");
            }, 2000);
            dispatch(
              setOrderdData({
                orderType: "",
                items: [],
                amountPaid: null,
                phone: "",
                username: "",
                address: "",
                cookingTime: null,
              })
            );
            dispatch(clearCart());
            return;
          }
        } catch (err) {
          console.error("Failed to fetch tables:", err);
          toast.error("Unable to check table availability", {
            position: "bottom-center",
            autoClose: 2000,
          });
          setDragX(0);
          return;
        }
      }

      setIsSwiped(true);
      toast.success("Order placed successfully!", {
        position: "bottom-center",
        autoClose: 2000,
      });

      //logic to post data in the DB
      try {
        const response = await axios.post(
          "https://royal-xy66.onrender.com/api/orderDetails",
          order
        );
        console.log("Order posted successfully:", response.data);
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Failed to place order!", {
          position: "bottom-center",
          autoClose: 2000,
        });
      }

      dispatch(
        setOrderdData({
          orderType: "",
          items: [],
          amountPaid: null,
          phone: "",
          username: "",
          address: "",
          cookingTime: null,
        })
      );
      dispatch(clearCart());

      setTimeout(() => {
        navigate("/menu");
      }, 2000);
    }

    setDragX(newX < 0 ? 0 : newX);
  };

  // Touch events
  const handleTouchMove = (e) => {
    if (!isSwiped) handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isSwiped) {
      setDragX(0);
    }
  };

  // Mouse events
  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (dragging && !isSwiped) {
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (!isSwiped) {
      setDragX(0);
    }
    setDragging(false);
  };

  return (
    <>
      <div
        ref={sliderRef}
        className="swipe-track"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="swipe-text">Swipe to Order</div>
        <div
          className="swipe-handle"
          onMouseDown={handleMouseDown}
          style={{ transform: `translateX(${dragX}px)` }}
        >
          <img style={{ height: "30px" }} src={arr} alt="Img" />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SwipeToOrder;
