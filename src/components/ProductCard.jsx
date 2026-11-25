import React, { useState } from "react";
import { money } from "../services/api";
export function ProductCard({
  product,
  add,
  bag,
  isWishlisted,
  toggleWishlist,
  openProduct,
}) {
  const [selected, setSelected] = useState("");
  const variant = product.variants.find((v) => v.id === Number(selected));
  const count = bag.find((row) => row.variantId === variant?.id)?.quantity || 0;
  return (
    <article className="product">
      <a
        className="product-image-link"
        href={`/products/${product.id}`}
        onClick={(event) => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          openProduct(product.id);
        }}
      >
        <div className="product-image">
          <img
            loading="lazy"
            src={"/images/" + product.image + ".webp"}
            alt={product.colour + " " + product.name}
          />
          <span className="product-category">{product.category}</span>
        </div>
      </a>
      <div className="product-content">
        {product.brand && (
          <p className="product-brand">
            {product.brand}
            {product.collection ? ` · ${product.collection}` : ""}
          </p>
        )}
        <div className="row">
          <h3>
            <a
              href={`/products/${product.id}`}
              onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                openProduct(product.id);
              }}
            >
              {product.name}
            </a>
          </h3>
          <strong>{money(product.price)}</strong>
        </div>
        <p className="colour">{product.colour}</p>
        <p className="product-description">{product.description}</p>
        <form
          className="buy"
          onSubmit={(e) => {
            e.preventDefault();
            add(variant.id, count + 1, product.name);
          }}
        >
          <select
            aria-label={"Size for " + product.name}
            required
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select size</option>
            {product.variants.map((v) => (
              <option key={v.id} value={v.id} disabled={!v.stock}>
                {v.size}
                {v.stock ? "" : " · sold out"}
              </option>
            ))}
          </select>
          <button disabled={variant && count >= Math.min(10, variant.stock)}>
            Add to bag
          </button>
        </form>
        <button
          className="wishlist-button"
          type="button"
          aria-pressed={isWishlisted}
          onClick={() => toggleWishlist(product.id, product.name)}
        >
          <svg
            viewBox="0 0 24 24"
            fill={isWishlisted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
          {isWishlisted ? "Added to wishlist" : "Add to wishlist"}
        </button>
      </div>
    </article>
  );
}
