import React, { useState } from "react";
import { ProductCard } from "../components/ProductCard";
export function Storefront({
  products,
  bag,
  add,
  search,
  wishlist,
  toggleWishlist,
  openProduct,
}) {
  const [category, setCategory] = useState("All");
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!normalizedSearch ||
        [p.name, p.brand, p.collection, p.category, p.colour, p.description]
          .filter(Boolean)
          .some((value) =>
            String(value).toLocaleLowerCase().includes(normalizedSearch),
          )),
  );
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">The menswear edit</span>
          <h1>
            Everyday
            <br />
            <i>essentials.</i>
          </h1>
          <p>
            Considered cuts, natural textures and layers for life in motion.
          </p>
          <a className="cta" href="#collection">
            Shop the collection
          </a>
        </div>
        <img
          src="/images/campaign.webp"
          alt="Model wearing the tobacco suede bomber in afternoon sunlight"
        />
      </section>
      <section id="collection">
        <div className="collection-top">
          <h2>The collection</h2>
          <div className="collection-filters">
            <div className="filter-row">
              <span>Categories</span>
              <nav aria-label="Product categories">
                {categories.map((name) => (
                  <button
                    key={name}
                    aria-pressed={category === name}
                    onClick={() => setCategory(name)}
                  >
                    {name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {filteredProducts.length ? (
          <div className="grid">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                add={add}
                bag={bag}
                isWishlisted={wishlist.has(p.id)}
                toggleWishlist={toggleWishlist}
                openProduct={openProduct}
              />
            ))}
          </div>
        ) : (
          <p className="no-results" role="status">
            No products match your search or category.
          </p>
        )}
      </section>
    </>
  );
}
