// src/components/ProductDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { fetchProductById } from "../api/products";
import type { ProductType } from "../types/products";

interface ProductDetailsProps {
  onAddToCart(product: ProductType): void;
}

export default function ProductDetails({ onAddToCart }: ProductDetailsProps) {
  const params = useParams(); // { id: string | undefined }
  const id = Number(params.id);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError("Некорректный id товара");
      setLoading(false);
      return;
    }
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const item = await fetchProductById(id, ac.signal);
        setProduct(item);
      } catch (e: unknown) {
        if ((e as Error)?.name !== "AbortError") {
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [id]);

  if (loading) return <div className="spinner">Загрузка…</div>;
  if (error)
    return (
      <div className="alert">
        <div>Ошибка: {error}</div>
        <Link className="btn" to="/">
          Назад к каталогу
        </Link>
      </div>
    );
  if (!product) return null;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <img className="card-img" src={product.image} alt={product.title} />
      <div className="card-body">
        <h2 className="card-title" style={{ fontSize: 20 }}>
          {product.title}
        </h2>
        <p className="card-price" style={{ fontSize: 18 }}>
          {product.price.toLocaleString()} ₽
        </p>
      </div>
      <div className="card-actions">
        <Link className="btn" to="/">
          ← К каталогу
        </Link>
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
