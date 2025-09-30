// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import "./index.css";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
// import ProductDetails from "./components/ProductDetails";
import { fetchProducts } from "./api/products";
import type { ProductType } from "./types/products";
import { Routes, Route, useSearchParams } from "react-router-dom";
// import CartPage from "./pages/CartPage";
import { lazy, Suspense } from "react";

const ProductDetails = lazy(() => import("./components/ProductDetails"));
const CartPage = lazy(() => import("./pages/CartPage"));

export default function App() {
  // корзина
  // const [cartItems, setCartItems] = useState<ProductType[]>([]);

  // поиск
  // const [query, setQuery] = useState<string>("");
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";

  const setQuery = (q: string) => {
    const next = new URLSearchParams(params);
    if (q) {
      next.set("q", q);
    } else {
      next.delete("q");
    }
    setParams(next, { replace: true }); // чтобы не плодить историю
  };

  // данные каталога
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await fetchProducts(ac.signal);
        setProducts(items);
      } catch (e) {
        if (
          typeof e === "object" &&
          e !== null &&
          "name" in e &&
          (e as { name?: string }).name !== "AbortError"
        ) {
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [reloadTick]);

  // const handleAddToCart = (product: ProductType) => {
  //   setCartItems((prev) => [...prev, product]);
  // };

  const normalized = query.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    if (!normalized) return products;
    return products.filter((p) => p.title.toLowerCase().includes(normalized));
  }, [products, normalized]);

  return (
    <div className="container">
      <Header />

      <main>
        <Suspense fallback={<div className="spinner">Загрузка…</div>}>
          <Routes>
            {/* Главная: поиск + список */}
            <Route
              path="/"
              element={
                <>
                  <h2 className="page-title">Каталог товаров</h2>
                  <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Поиск по названию…"
                  />

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

                  {!loading && !error && (
                    <>
                      <ProductList
                        products={filteredProducts}
                        // onAddToCart={handleAddToCart}
                      />
                      {filteredProducts.length === 0 && (
                        <p style={{ marginTop: 12, opacity: 0.7 }}>
                          Ничего не найдено по запросу «{query}».
                        </p>
                      )}
                    </>
                  )}
                </>
              }
            />

            {/* Страница карточки товара */}
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* Страница корзины */}
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
