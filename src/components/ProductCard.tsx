// src/components/ProductCard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProductType } from "../types/products";
import styles from "./ProductCard.module.css";
import { useAppDispatch } from "../store/hooks";
import { addItem } from "../store/cartSlice";

interface ProductCardProps {
  product: ProductType;
  //   onAddToCart(product: ProductType): void;
}

export default function ProductCard({
  product,
}: //   onAddToCart,
ProductCardProps) {
  const [likes, setLikes] = useState<number>(0);
  const dispatch = useAppDispatch();

  return (
    <div className="card">
      <Link to={`/product/${product.id}`}>
        <img
          className={styles.cardImg}
          src={product.image}
          alt={product.title}
        />
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
          onClick={() => dispatch(addItem(product))}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
