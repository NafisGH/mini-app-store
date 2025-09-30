import { configureStore } from "@reduxjs/toolkit";
import { cartReducer, type CartState } from "./cartSlice";
import { productApi } from "./api";

const PERSIST_KEY = "cart";

function loadPreloadedState(): { cart: CartState } | undefined {
  try {
    // Защита для сред без window (SSR, тесты и т.п.)
    if (typeof window === "undefined" || !window.localStorage) return undefined;
    const raw = window.localStorage.getItem(PERSIST_KEY);
    if (!raw) return undefined;
    const cart = JSON.parse(raw) as CartState;
    return { cart };
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(productApi.middleware), // ← добавляем middleware
  preloadedState: loadPreloadedState(),
});

store.subscribe(() => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    const state = store.getState();
    window.localStorage.setItem(PERSIST_KEY, JSON.stringify(state.cart));
  } catch {
    // Intentionally left blank: ignore localStorage errors
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
