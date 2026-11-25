import React, { useEffect, useState } from "react";
import { Storefront } from "./pages/Storefront";
import { Bag } from "./pages/Bag";
import { Wishlist } from "./pages/Wishlist";
import { ProductDetail } from "./pages/ProductDetail";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { useBag } from "./hooks/useBag";
import catalog from "./data/products.json";
import { money, previewMode, request } from "./services/api";
import { getStoredUser, logout } from "./services/auth";

function routeFromPath(pathname) {
  const productMatch = pathname.match(/^\/products\/(\d+)\/?$/);
  if (productMatch) {
    return { page: "product", productId: Number(productMatch[1]) };
  }

  const pages = {
    "/": "shop",
    "/bag": "bag",
    "/wishlist": "wishlist",
    "/profile": "profile",
    "/receipt": "receipt",
  };
  return { page: pages[pathname.replace(/\/$/, "") || "/"] || "shop", productId: null };
}

export default function App() {
  const [user, setUser] = useState(getStoredUser);   // null = not logged in
  const [showLogin, setShowLogin] = useState(false);
  const [products, setProducts] = useState(previewMode ? catalog : null);
  const [error, setError] = useState("");
  const [route, setRoute] = useState(() => routeFromPath(window.location.pathname));
  const { page, productId } = route;
  const [receipt, setReceipt] = useState(null);
  const [notice, setNotice] = useState(null);
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState(() => new Set());
  const { bag, change, clear } = useBag();

  function toggleWishlist(productId, productName) {
    const adding = !wishlist.has(productId);
    setWishlist((current) => {
      const updated = new Set(current);
      if (updated.has(productId)) updated.delete(productId);
      else updated.add(productId);
      return updated;
    });
    setNotice({
      type: adding ? "wishlist-add" : "wishlist-remove",
      title: adding ? "Added to your wishlist" : "Removed from your wishlist",
      detail: productName,
    });
  }

  async function refresh() {
    try {
      setProducts(await request("products"));
      setError("");
    } catch {
      setError(
        "The catalog could not load. Check that the API and database are running.",
      );
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  useEffect(() => {
    function handlePopState() {
      setRoute(routeFromPath(window.location.pathname));
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(id);
  }, [notice]);
  if (showLogin) {
    return (
      <Login
        onSuccess={(u) => {
          setUser(u);
          setShowLogin(false);
        }}
        onCancel={() => setShowLogin(false)}
      />
    );
  }
  function navigate(next) {
    const paths = {
      shop: "/",
      bag: "/bag",
      wishlist: "/wishlist",
      profile: "/profile",
      receipt: "/receipt",
    };
    const path = paths[next] || "/";
    window.history.pushState({}, "", path);
    setRoute(routeFromPath(path));
    window.scrollTo(0, 0);
  }
  function openProduct(id) {
    const path = `/products/${id}`;
    window.history.pushState({}, "", path);
    setRoute(routeFromPath(path));
    window.scrollTo(0, 0);
  }
  function showCollection() {
    navigate("shop");
    window.setTimeout(() => {
      document.getElementById("collection")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  }
  function addToBag(id, quantity, name) {
    change(id, quantity);
    setNotice({
      type: "bag",
      title: "Added to your bag",
      detail: `${name} · Qty ${quantity}`,
    });
  }
  function signOut() {
    logout();
    setUser(null);
    clear();
    navigate("shop");
  }
  return (
    <>
      <header className="site-header">
        <button className="brand" onClick={() => navigate("shop")}>
          Loom <i>&amp;</i> Field
        </button>
        <nav className="primary-nav" aria-label="Primary navigation">
          <button
            className={page === "shop" ? "active" : ""}
            onClick={() => navigate("shop")}
          >
            Shop
          </button>
          <button onClick={showCollection}>Collection</button>
          <button
            className={page === "wishlist" ? "active" : ""}
            onClick={() => navigate("wishlist")}
          >
            Wishlist ({wishlist.size})
          </button>
        </nav>
        {page === "shop" && (
          <div className="header-search">
            <label className="visually-hidden" htmlFor="product-search">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
        )}
        <div className="header-actions">
          {user ? (
            <button
              className={`profile-button${page === "profile" ? " active" : ""}`}
              aria-label="Open profile"
              title="Profile"
              onClick={() => navigate("profile")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.7-3.1 3.4-5 7-5s6.3 1.9 7 5" />
              </svg>
            </button>
          ) : (
            <button className="bag-button" onClick={() => setShowLogin(true)}>
              Sign in
            </button>
          )}
          <button
            className="bag-button"
            onClick={() => navigate("bag")}
          >
            <svg
              className="bag-icon"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2.5 3.5h2l2.2 10h9.5l2-7.5H5.4" />
              <circle cx="8" cy="17" r="1" />
              <circle cx="15" cy="17" r="1" />
            </svg>
            Bag <span>({bag.reduce((n, r) => n + r.quantity, 0)})</span>
          </button>
        </div>
      </header>
      <main>
        {error && (
          <p role="alert">
            {error} <button onClick={refresh}>Retry</button>
          </p>
        )}
        {page === "receipt" && receipt ? (
          <section className="receipt">
            <h1>Order confirmed.</h1>
            <p>
              Order reference <strong>{receipt.id}</strong>
            </p>
            <p>Pay {money(receipt.total)} on delivery.</p>
            <button onClick={() => navigate("shop")}>Continue shopping</button>
          </section>
        ) : !products ? (
          !error && <p role="status">Loading collection…</p>
        ) : page === "bag" ? (
          <Bag
            bag={bag}
            products={products}
            change={change}
            refresh={refresh}
            back={() => navigate("shop")}
            complete={(order) => {
              setReceipt(order);
              clear();
              navigate("receipt");
              refresh();
            }}
          />
        ) : page === "profile" && user ? (
          <Profile
            onBack={() => navigate("shop")}
            onSignOut={signOut}
          />
        ) : page === "wishlist" ? (
          <Wishlist
            products={products}
            bag={bag}
            wishlist={wishlist}
            add={addToBag}
            toggleWishlist={toggleWishlist}
            openProduct={openProduct}
            back={() => navigate("shop")}
          />
        ) : page === "product" ? (
          <ProductDetail
            key={productId}
            product={products.find((item) => item.id === productId)}
            bag={bag}
            isWishlisted={wishlist.has(productId)}
            add={addToBag}
            toggleWishlist={toggleWishlist}
            back={() => navigate("shop")}
          />
        ) : (
          <Storefront
            products={products}
            bag={bag}
            search={search}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            openProduct={openProduct}
            add={addToBag}
          />
        )}
      </main>
      {notice && (
        <div
          className={`toast toast-${notice.type}`}
          role="status"
          aria-live="polite"
        >
          <span className="toast-icon" aria-hidden="true">
            {notice.type === "bag" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill={notice.type === "wishlist-add" ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
              </svg>
            )}
          </span>
          <span className="toast-copy">
            <strong>{notice.title}</strong>
            <span>{notice.detail}</span>
          </span>
          <button
            className="toast-action"
            type="button"
            onClick={() => {
              const destination = notice.type === "bag" ? "bag" : "wishlist";
              setNotice(null);
              navigate(destination);
            }}
          >
            {notice.type === "bag" ? "View bag" : "View wishlist"}
          </button>
          <button
            className="toast-dismiss"
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice(null)}
          >
            ×
          </button>
        </div>
      )}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <button className="footer-logo" onClick={() => navigate("shop")}>
              Loom <i>&amp;</i> Field
            </button>
            <p>
              Considered cuts, natural textures and layers for life in motion.
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <h2>Explore</h2>
            <button onClick={() => navigate("shop")}>Shop all</button>
            <button onClick={showCollection}>Collection</button>
            <button onClick={() => navigate("wishlist")}>
              Wishlist ({wishlist.size})
            </button>
            <button onClick={() => navigate("bag")}>Your bag</button>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Loom &amp; Field</span>
        </div>
      </footer>
    </>
  );
}
