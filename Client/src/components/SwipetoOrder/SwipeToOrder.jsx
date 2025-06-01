import React, { useRef, useState, useEffect } from "react";
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

  // Helper: compute the maximum X‐offset (maxRight) inside the slider
  const getMaxRight = () => {
    if (!sliderRef.current) return 0;
    const sliderWidth = sliderRef.current.offsetWidth;
    const handleWidth = 60; // same as CSS .swipe-handle width
    const padding = 15; // same as CSS .swipe-track padding if any
    return sliderWidth - handleWidth - padding;
  };

  // MAIN handler to move the handle
  const handleMove = async (clientX) => {
    if (isSwiped) return; // once swiped, bail out

    const offsetLeft = sliderRef.current.getBoundingClientRect().left;
    const maxRight = getMaxRight();
    let newX = clientX - offsetLeft;
    // Clamp between 0 and maxRight
    newX = Math.max(0, Math.min(newX, maxRight));

    // Validation: make sure all required fields are filled
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

    // If we’ve dragged all the way to the right
    if (newX >= maxRight) {
      // Prevent double‐trigger
      setIsSwiped(true);
      setDragX(maxRight); // stick the handle fully to the right

      // If DineIn, check table availability
      if (order.orderType === "DineIn") {
        try {
          const res = await axios.get(
            "https://royal-xy66.onrender.com/api/tables"
          );
          const tablesList = res.data;
          const availableTables = tablesList.filter(
            (table) => table.status === "available"
          );
          if (availableTables.length === 0 || tablesList.length === 0) {
            toast.error("No tables available!", {
              position: "bottom-center",
              autoClose: 2000,
            });
            // Reset everything after a moment
            setTimeout(() => {
              navigate("/menu");
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
            }, 2000);
            return;
          }
        } catch (err) {
          console.error("Failed to fetch tables:", err);
          toast.error("Unable to check table availability", {
            position: "bottom-center",
            autoClose: 2000,
          });
          // Let the handle stay; user can navigate back manually
          return;
        }
      }

      // Place the order
      toast.success("Order placed successfully!", {
        position: "bottom-center",
        autoClose: 2000,
      });

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

      // Clear Redux state
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

      // After toast, navigate back to /menu
      setTimeout(() => {
        navigate("/menu");
      }, 2000);

      return;
    }

    // If not yet at maxRight, just update the drag position
    setDragX(newX);
  };

  // === Touch events ===
  const handleTouchMove = (e) => {
    if (isSwiped) return;
    handleMove(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (isSwiped) return;
    // If the user lets go before fully swiped, reset to zero
    setDragX(0);
  };

  // === Mouse events ===
  const handleMouseDown = () => {
    if (isSwiped) return;
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
          style={{
            transform: `translateX(${dragX}px)`,
            cursor: isSwiped ? "default" : "grab", // change cursor once swiped
            // Optionally disable pointer events completely:
            pointerEvents: isSwiped ? "none" : "auto",
          }}
        >
          <img style={{ height: "30px" }} src={arr} alt="Swipe Arrow" />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SwipeToOrder;
