import { previewMode } from "../services/api";
import React, { useRef, useState } from "react";
import { money, request } from "../services/api";
export function Bag({ bag, products, change, complete, refresh, back }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const retry = useRef({});
  const rows = bag.map((row) => {
    const product = products.find((p) =>
      p.variants.some((v) => v.id === row.variantId),
    );
    return {
      ...row,
      product,
      variant: product?.variants.find((v) => v.id === row.variantId),
    };
  });
  const unavailable = rows.some(
    (r) => !r.variant || r.quantity > r.variant.stock,
  );
  const total = rows.reduce(
    (sum, r) => sum + (r.product?.price || 0) * r.quantity,
    0,
  );
  async function checkout(event) {
    event.preventDefault();
    if (busy || unavailable) return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const payload = JSON.stringify({ ...values, items: bag });
    if (retry.current.payload !== payload)
      retry.current = { payload, key: crypto.randomUUID() };
    setBusy(true);
    setError("");
    try {
      const receipt = await request("orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: bag,
          requestKey: retry.current.key,
        }),
      });
      complete(receipt);
    } catch (err) {
      setError(err.message);
      await refresh();
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="bag">
      <h1>Your bag</h1>
      {!bag.length ? (
        <>
          <p>Your bag is empty.</p>
          <button onClick={back}>Explore collection</button>
        </>
      ) : (
        <div className="checkout">
          <div>
            {rows.map(({ product, variant, variantId, quantity }) => (
              <article key={variantId} className="line">
                {product && (
                  <img alt="" src={"/images/" + product.image + ".webp"} />
                )}
                <div>
                  <h3>{product?.name || "Unavailable product"}</h3>
                  <p>
                    {product?.colour} · {variant?.size}
                  </p>
                  <label>
                    Quantity{" "}
                    <input
                      aria-label={"Quantity for " + (product?.name || "item")}
                      type="number"
                      min="1"
                      max={Math.max(1, Math.min(10, variant?.stock || 0))}
                      value={quantity}
                      disabled={busy}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (Number.isInteger(n) && n >= 1 && n <= 10)
                          change(variantId, n);
                      }}
                    />
                  </label>
                  <button
                    className="link"
                    disabled={busy}
                    onClick={() => change(variantId, 0)}
                  >
                    Remove
                  </button>
                </div>
                <strong>{money((product?.price || 0) * quantity)}</strong>
              </article>
            ))}
          </div>
          {previewMode ? <section className="delivery">
            <h2>Bag summary</h2>
            <div className="row"><strong>Total</strong><strong>{money(total)}</strong></div>
            <p>Frontend preview. Connect the Express API to enable checkout.</p>
          </section> : <form className="delivery" onSubmit={checkout}>
            <h2>Delivery details</h2>
            <label>
              Full name
              <input
                name="customer"
                autoComplete="name"
                required
                minLength="2"
                maxLength="100"
              />
            </label>
            <label>
              Mobile number
              <input
                name="phone"
                autoComplete="tel-national"
                type="tel"
                pattern="[6-9][0-9]{9}"
                title="Enter a 10-digit Indian mobile number"
                placeholder="10-digit mobile number"
                required
              />
            </label>
            <label>
              Delivery address
              <textarea
                name="address"
                autoComplete="street-address"
                placeholder="House, street, city, state and PIN code"
                required
                minLength="10"
                maxLength="500"
              />
            </label>
            <p>Payment on delivery · Free shipping</p>
            <div className="row">
              <strong>Total</strong>
              <strong>{money(total)}</strong>
            </div>
            {unavailable && (
              <p role="alert">
                A size has insufficient stock. Reduce its quantity or remove it.
              </p>
            )}
            {error && <p role="alert">{error}</p>}
            <button disabled={busy || unavailable}>
              {busy ? "Placing order…" : "Place order"}
            </button>
          </form>}
        </div>
      )}
    </section>
  );
}
