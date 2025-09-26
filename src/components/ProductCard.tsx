import type { ProductType } from "../types/products";
import { useState } from "react";

interface ProductCardProps {
  product: ProductType;
  onAddToCart: (product: ProductType) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [likes, setLikes] = useState<number>(0);

  return (
    <div className="card">
      <img className="card-img" src={product.image} alt={product.title} />
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-price">{product.price.toLocaleString()} ₽</p>
      </div>
      <div className="card-actions">
        <button className="btn" onClick={() => setLikes((n) => n + 1)}>
          ♥ {likes}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => onAddToCart(product)}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
