import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectCartCount } from "../store/cartSlice";

export default function Header() {
  const cartCount = useAppSelector(selectCartCount);
  return (
    <header className="header">
      <h1 className="brand">
        <Link to="/" className="nav-link">
          Мой магазин
        </Link>
      </h1>
      <nav className="nav">
        <NavLink to="/" className="nav-link">
          Каталог
        </NavLink>

        <NavLink to="/cart" className="nav-link">
          Корзина
          <span className="badge" aria-label="Количество товаров в корзине">
            {cartCount ?? 0}
          </span>
        </NavLink>
      </nav>
    </header>
  );
}
