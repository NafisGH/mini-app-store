import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  removeItem,
  setQty,
  clear,
} from "../store/cartSlice";

export default function CartPage() {
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();

  if (items.length === 0) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <h2 className="page-title">Корзина пуста</h2>
        <p style={{ margin: "8px 0 16px" }}>
          Добавьте товары из <Link to="/">каталога</Link>.
        </p>
        <Link className="btn btn-primary" to="/">
          ← В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <h2 className="page-title">Корзина</h2>

      <ul className="cart-list">
        {items.map(({ product, qty }) => {
          const lineTotal = qty * product.price;
          return (
            <li className="cart-row" key={product.id}>
              <img
                className="cart-thumb"
                src={product.image}
                alt={product.title}
              />
              <div className="cart-main">
                <Link to={`/product/${product.id}`} className="cart-title">
                  {product.title}
                </Link>
                <div className="cart-meta">
                  <span className="price">{product.price.toFixed(2)} ₽</span>
                </div>
              </div>

              <div className="qty">
                <button
                  className="btn"
                  onClick={() =>
                    dispatch(
                      setQty({ id: product.id, qty: Math.max(0, qty - 1) })
                    )
                  }
                  aria-label="Уменьшить количество"
                >
                  −
                </button>

                <input
                  className="qty-input"
                  type="number"
                  min={0}
                  value={qty}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    const clamped = Number.isFinite(next)
                      ? Math.max(0, next)
                      : 0;
                    dispatch(setQty({ id: product.id, qty: clamped }));
                  }}
                />

                <button
                  className="btn"
                  onClick={() =>
                    dispatch(setQty({ id: product.id, qty: qty + 1 }))
                  }
                  aria-label="Увеличить количество"
                >
                  +
                </button>
              </div>

              <div className="line-total">{lineTotal.toFixed(2)} ₽</div>

              <button
                className="btn"
                onClick={() => dispatch(removeItem(product.id))}
                aria-label="Удалить из корзины"
              >
                Удалить
              </button>
            </li>
          );
        })}
      </ul>

      <div className="cart-summary">
        <button className="btn" onClick={() => dispatch(clear())}>
          Очистить корзину
        </button>
        <div className="cart-total">
          Итого: <strong>{total.toFixed(2)} ₽</strong>
        </div>
        <button className="btn btn-primary" disabled={items.length === 0}>
          Оформить заказ
        </button>
      </div>
    </div>
  );
}
