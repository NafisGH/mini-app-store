// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import "./index.css";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import { fetchProducts } from "./api/products";
import type { ProductType } from "./types/products";

export default function App() {
  // Корзина
  const [cartItems, setCartItems] = useState<ProductType[]>([]);

  // Поиск
  const [query, setQuery] = useState<string>("");

  // Данные с сервера
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Триггер для ручного перезапроса (кнопка «Повторить попытку»)
  const [reloadTick, setReloadTick] = useState(0);

  // загружаем товары при монтировании/повторной попытке
  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const items = await fetchProducts(ac.signal);
        setProducts(items);
      } catch (e) {
        // Если это AbortError — просто выходим (компонент размонтирован)
        if (e instanceof Error && e.name === "AbortError") return;
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => ac.abort(); // отменяем fetch при размонтировании/перезапуске эффекта
  }, [reloadTick]);

  const handleAddToCart = (product: ProductType) => {
    setCartItems((prev) => [...prev, product]); // иммутабельное обновление
  };

  const normalized = query.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    const source = products;
    if (!normalized) return source;
    return source.filter((p) => p.title.toLowerCase().includes(normalized));
  }, [products, normalized]);

  return (
    <div className="container">
      <Header cartCount={cartItems.length} />

      <main>
        <h2 className="page-title">Каталог товаров</h2>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Поиск по названию…"
        />
        {/* Состояния загрузки/ошибки */}
        {loading && <div className="spinner">Загрузка…</div>}

        {error && (
          <div className="alert">
            <div>Не удалось загрузить товары: {error}</div>
            <button
              className="btn"
              onClick={() => setReloadTick((n) => n + 1)}
              type="button"
            >
              Повторить попытку
            </button>
          </div>
        )}

        {/* Список товаров (показываем только когда не грузимся и нет ошибки) */}
        {!loading && !error && (
          <>
            <ProductList
              products={filteredProducts}
              onAddToCart={handleAddToCart}
            />
            {filteredProducts.length === 0 && (
              <p style={{ marginTop: 12, opacity: 0.7 }}>
                Ничего не найдено по запросу «{query}».
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
