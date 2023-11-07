import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartItems from ".././cartItems";

const url = " https://course-api.com/react-useReducer-cart-project";

const initialState = {
  cartItems: cartItems,
  amount: 4,
  total: 0,
  isLoading: true,
};

export const getCartItems = createAsyncThunk("cart/getCartItems", () => {
  return fetch(url)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },

    removItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },

    increase: (state, action) => {
      const cartItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      cartItem.amount = cartItem.amount + 1;
    },

    // {payload } is nothing we jusst directly destructured the payload from
    //  action so we do nt need to write action.payload we can directly write
    //  state.payload
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item.id === payload.id);
      cartItem.amount =
        cartItem.amount > 0 ? cartItem.amount - 1 : cartItem.amount;
    },

    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },

  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },

    [getCartItems.fulfilled]: (state, action) => {
      console.log("acrion here", action);
      state.isLoading = false;
      state.cartItems = action.payload;
    },

    [getCartItems.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

// console.log(cartSlice)
export const { clearCart, removItem, decrease, increase, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
