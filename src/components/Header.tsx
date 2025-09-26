interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="brand">Мой магазин</h1>
      <nav className="nav">
        <a className="nav-link" href="#">
          Каталог
        </a>
        <a className="nav-link" href="#">
          Корзина
          <span className="badge" aria-label="Количество товаров в корзине">
            {cartCount}
          </span>
        </a>
      </nav>
    </header>
  );
}
