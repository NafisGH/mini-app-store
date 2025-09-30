import { useMemo } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";
import ProductDetails from "./components/ProductDetails";
import { useGetProductsQuery } from "./store/api";
// import type { ProductType } from "./types/products";
import CartPage from "./pages/CartPage";

export default function App() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";

  // вместо fetch:
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useGetProductsQuery();

  const normalized = query.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    if (!normalized) return products;
    return products.filter((p) => p.title.toLowerCase().includes(normalized));
  }, [products, normalized]);

  return (
    <div className="container">
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h2 className="page-title">Каталог товаров</h2>
                <SearchBar
                  value={query}
                  onChange={(q) => {
                    const next = new URLSearchParams(params);
                    if (q) next.set("q", q);
                    else next.delete("q");
                    setParams(next, { replace: true });
                  }}
                  placeholder="Поиск по названию…"
                />

                {isLoading && <div className="spinner">Загрузка…</div>}
                {isError && (
                  <div className="alert">
                    <div>Не удалось загрузить товары</div>
                    <button className="btn" onClick={() => refetch()}>
                      Повторить
                    </button>
                    {error && (
                      <pre style={{ opacity: 0.6 }}>
                        {String(
                          typeof error === "object" &&
                            error !== null &&
                            "status" in error
                            ? (error as { status?: unknown }).status
                            : error
                        )}
                      </pre>
                    )}
                  </div>
                )}
                {!isLoading && !isError && (
                  <>
                    <ProductList products={filteredProducts} />
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
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </div>
  );
}
