// src/api/products.ts
import type { ProductType } from "../types/products";

type RemoteProduct = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export async function fetchProducts(
  signal?: AbortSignal
): Promise<ProductType[]> {
  const res = await fetch("https://fakestoreapi.com/products", { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const data: RemoteProduct[] = await res.json();
  return data.map(({ id, title, price, image }) => ({
    id,
    title,
    price,
    image,
  }));
}

// НОВОЕ: получить товар по id
export async function fetchProductById(
  id: number,
  signal?: AbortSignal
): Promise<ProductType> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const data: RemoteProduct = await res.json();
  return {
    id: data.id,
    title: data.title,
    price: data.price,
    image: data.image,
  };
}
