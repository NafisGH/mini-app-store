// import { useState } from "react";
import "./App.css";
import "./index.css";
import { MOCK_PRODUCTS } from "./data/mockProducts";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import { useState } from "react";
import type { ProductType } from "./types/products";

function App() {
  const [cartItems, setCartItems] = useState<ProductType[]>([]);
  const handleAddToCart = (product: ProductType) => {
    setCartItems((prev) => [...prev, product]);
  };
  return (
    <>
      <div className="container">
        <Header cartCount={cartItems.length} />
        <main>
          <h2 className="page-title">Каталог товаров</h2>
          <ProductList products={MOCK_PRODUCTS} onAddToCart={handleAddToCart} />
        </main>
      </div>
    </>
  );
}

export default App;
