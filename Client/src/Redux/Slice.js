import { createSlice } from "@reduxjs/toolkit";
export const fooditemsSlice = createSlice({
  name: "fooditems",
  initialState: {
    addedItems: [],

    orderData: {
      orderType: "",
      items: [],
      amountPaid: null,
      phone: "",
      username: "",
      address: "",
      cookingTime: null,
    },
  },
  reducers: {
    addItem: (state, action) => {
      const { id, name, price, imgUrl, category, cookingTime } = action.payload;
      const existing = state.addedItems.find((item) => item.id === id);
      if (existing) {
        existing.count += 1;
      } else {
        state.addedItems.push({
          id,
          name,
          price,
          imgUrl,
          category,
          cookingTime,
          count: 1,
        });
      }
    },
    decrementItem: (state, action) => {
      const id = action.payload;
      const existing = state.addedItems.find((item) => item.id === id);
      if (!existing) return;
      if (existing.count > 1) {
        existing.count -= 1;
      } else {
        state.addedItems = state.addedItems.filter((item) => item.id !== id);
      }
    },
    removeItem: (state, action) => {
      const idToRemove = action.payload;
      state.addedItems = state.addedItems.filter(
        (item) => item.id !== idToRemove
      );
    },
    clearCart: (state) => {
      state.addedItems = [];
    },
    setOrderdData: (state, action) => {
      state.orderData = action.payload;
    },
    setOrderdType: (state, action) => {
      state.orderData.orderType = action.payload;
    },
    setItems: (state, action) => {
      const payload = action.payload;
      if (Array.isArray(payload)) {
        // If payload is an array, directly assign it
        state.orderData.items = payload.map((item) => ({
          name: item.name,
          count: item.count,
        }));
      } else if (payload && typeof payload === "object") {
        // If single object, wrap it in an array
        state.orderData.items = [
          {
            name: payload.name,
            count: payload.count,
          },
        ];
      }
    },
    setAmountPaid: (state, action) => {
      state.orderData.amountPaid = action.payload;
    },
    setPhone: (state, action) => {
      state.orderData.phone = action.payload;
    },
    setCookingTime: (state, action) => {
      state.orderData.cookingTime = action.payload;
    },
    setUsername: (state, action) => {
      state.orderData.username = action.payload;
    },
    setAddress: (state, action) => {
      state.orderData.address = action.payload;
    },
  },
});

export const {
  addItem,
  decrementItem,
  clearCart,
  removeItem,
  setOrderdType,
  setItems,
  setAmountPaid,
  setPhone,
  setCookingTime,
  setOrderdData,
  setUsername,
  setAddress,
} = fooditemsSlice.actions;

export default fooditemsSlice.reducer;
