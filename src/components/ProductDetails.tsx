import { Link, useParams } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { addItem } from "../store/cartSlice";
import styles from "./ProductDetails.module.css";
import { useGetProductQuery } from "../store/api"; // ← новый импорт

export default function ProductDetails() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();

  const {
    data: product,
    isLoading,
    isError,
    refetch,
    error,
  } = useGetProductQuery(id, { skip: !Number.isFinite(id) }); // защита от NaN

  if (!Number.isFinite(id)) {
    return (
      <div className="alert">
        Некорректный id товара. <Link to="/">Назад</Link>
      </div>
    );
  }

  if (isLoading) return <div className="spinner">Загрузка…</div>;
  if (isError || !product) {
    return (
      <div className="alert">
        Не удалось загрузить товар.
        <div style={{ marginTop: 8 }}>
          <button className="btn" onClick={() => refetch()}>
            Повторить
          </button>
          {error && (
            <pre style={{ opacity: 0.6 }}>
              {typeof error === "object" && error !== null && "status" in error
                ? String((error as { status?: unknown }).status)
                : String(error)}
            </pre>
          )}
        </div>
        <Link className="btn" to="/" style={{ marginLeft: 8 }}>
          ← К каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className={`card ${styles.root}`}>
      <img className={styles.cardImg} src={product.image} alt={product.title} />
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
          onClick={() => dispatch(addItem(product))}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
