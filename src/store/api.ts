import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProductType } from "../types/products";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://fakestoreapi.com/" }),
  endpoints: (builder) => ({
    getProducts: builder.query<ProductType[], void>({
      query: () => "products",
    }),
    getProduct: builder.query<ProductType, number>({
      query: (id) => `products/${id}`,
    }),
  }),
});
export const { useGetProductsQuery, useGetProductQuery } = productApi;
