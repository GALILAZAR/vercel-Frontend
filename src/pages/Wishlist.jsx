import React from "react";
import { ProductCard } from "../components/ProductCard";

export function Wishlist({
  products,
  bag,
  wishlist,
  add,
  toggleWishlist,
  openProduct,
  back,
}) {
  const savedProducts = products.filter((product) => wishlist.has(product.id));

  return (
    <section className="wishlist">
      <div className="row">
        <h1>Your wishlist</h1>
        <button className="wishlist-back" onClick={back}>
          Continue shopping
        </button>
      </div>
      {savedProducts.length ? (
        <div className="grid">
          {savedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              add={add}
              bag={bag}
              isWishlisted
              toggleWishlist={toggleWishlist}
              openProduct={openProduct}
            />
          ))}
        </div>
      ) : (
        <p className="no-results" role="status">
          Your wishlist is empty. Add products you like and they’ll appear here.
        </p>
      )}
    </section>
  );
}
