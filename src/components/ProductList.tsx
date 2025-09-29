import type { ProductType } from "../types/products";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: ProductType[];
  //   onAddToCart: (product: ProductType) => void;
}

export default function ProductList({
  products,
}: //   onAddToCart,
ProductListProps) {
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
