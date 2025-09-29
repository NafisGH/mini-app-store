import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ProductType } from "../types/products";
import type { RootState } from "./store";

export type CartItem = {
  product: ProductType;
  qty: number;
};

type CartState = {
  // ключ — id товара
  items: Record<number, CartItem>;
};

const initialState: CartState = { items: {} };

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<ProductType>) {
      const p = action.payload;
      console.log(p);
      const existing = state.items[p.id];
      console.log(existing);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items[p.id] = { product: p, qty: 1 };
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      delete state.items[action.payload];
    },
    clear(state) {
      state.items = {};
    },
    setQty(state, action: PayloadAction<{ id: number; qty: number }>) {
      const { id, qty } = action.payload;
      const item = state.items[id];
      if (!item) return;
      item.qty = Math.max(0, qty);
      if (item.qty === 0) delete state.items[id];
    },
  },
});

export const { addItem, removeItem, clear, setQty } = slice.actions;
export const cartReducer = slice.reducer;

/** Базовый селектор: берём словарь позиций по id */
const selectItemsMap = (s: RootState) => s.cart.items;

// Селекторы
/** Массив позиций — будет новым ТОЛЬКО если изменился словарь items */
export const selectCartItems = createSelector([selectItemsMap], (items) =>
  Object.values(items)
);

/** Кол-во штук в корзине */
export const selectCartCount = createSelector([selectCartItems], (arr) =>
  arr.reduce((sum, it) => sum + it.qty, 0)
);

/** Итоговая сумма */
export const selectCartTotal = createSelector([selectCartItems], (arr) =>
  arr.reduce((sum, it) => sum + it.qty * it.product.price, 0)
);
