import type { ProductType } from "../types/products";

// Ответ мок  на запрос

type RemoteProduct = {
  id: number;
  title: string;
  price: number;
  image: string;
};

/** Загрузить товары и привести к нашему доменному типу Product */
export async function fetchProducts(
  signal?: AbortSignal
): Promise<ProductType[]> {
  const res = await fetch("https://fakestoreapi.com/products", { signal });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const data: RemoteProduct[] = await res.json();
  // Маппим внешний формат к нашему — UI не зависит от API
  return data.map(({ id, title, price, image }) => ({
    id,
    title,
    price,
    image,
  }));
}
