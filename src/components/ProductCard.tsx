// src/components/ProductCard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProductType } from "../types/products";

interface ProductCardProps {
  product: ProductType;
  onAddToCart(product: ProductType): void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [likes, setLikes] = useState<number>(0);

  return (
    <div className="card">
      <Link to={`/product/${product.id}`}>
        <img className="card-img" src={product.image} alt={product.title} />
      </Link>

      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h3>
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
