import React, { useState } from "react";
import { money } from "../services/api";

export function ProductDetail({
  product,
  bag,
  isWishlisted,
  add,
  toggleWishlist,
  back,
}) {
  const [selected, setSelected] = useState("");

  if (!product) {
    return (
      <section className="product-detail product-not-found">
        <h1>Product not found</h1>
        <p>This product may have been removed from the collection.</p>
        <button onClick={back}>Back to collection</button>
      </section>
    );
  }

  const variant = product.variants.find((item) => item.id === Number(selected));
  const count = bag.find((row) => row.variantId === variant?.id)?.quantity || 0;
  const sizeSelectId = `product-size-${product.id}`;

  return (
    <section className="product-detail">
      <button className="detail-back" onClick={back}>
        ← Back to collection
      </button>
      <div className="product-detail-layout">
        <div className="product-detail-image">
          <img
            src={`/images/${product.image}.webp`}
            alt={`${product.colour} ${product.name}`}
          />
          <span className="product-category">{product.category}</span>
        </div>
        <div className="product-detail-info">
          {product.brand && (
            <p className="product-detail-brand">
              {product.brand}
              {product.collection ? ` · ${product.collection}` : ""}
            </p>
          )}
          <h1>{product.name}</h1>
          <p className="product-detail-colour">Colour · {product.colour}</p>
          <strong className="product-detail-price">{money(product.price)}</strong>
          <p className="product-detail-description">{product.description}</p>
          <form
            className="detail-purchase"
            onSubmit={(event) => {
              event.preventDefault();
              add(variant.id, count + 1, product.name);
            }}
          >
            <label htmlFor={sizeSelectId}>Select your size</label>
            <select
              id={sizeSelectId}
              required
              value={selected}
              onChange={(event) => setSelected(event.target.value)}
            >
              <option value="">Choose a size</option>
              {product.variants.map((item) => (
                <option key={item.id} value={item.id} disabled={!item.stock}>
                  {item.size}
                  {item.stock ? "" : " · sold out"}
                </option>
              ))}
            </select>
            <button disabled={variant && count >= Math.min(10, variant.stock)}>
              Add to bag
            </button>
          </form>
          <button
            className="wishlist-button detail-wishlist"
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
          <p className="detail-service-note">
            Free shipping <span>·</span> Payment on delivery
          </p>
        </div>
      </div>
    </section>
  );
}
