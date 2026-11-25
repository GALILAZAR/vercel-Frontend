import React, { useEffect, useState } from "react";
import { getAccountDetails, getOrderHistory } from "../services/auth";
import { money } from "../services/api";

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function Profile({ onBack, onSignOut }) {
  const [account, setAccount] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    Promise.all([getAccountDetails(), getOrderHistory()])
      .then(([accountDetails, orderList]) => {
        if (!active) return;
        setAccount(accountDetails);
        setOrders(orderList);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reload]);

  return (
    <section className="profile">
      <div className="profile-heading">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>Profile &amp; activity</h1>
        </div>
        <div className="profile-actions">
          <button className="profile-back" onClick={onBack}>
            Back to shop
          </button>
          <button className="profile-signout" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </div>

      {loading && <p role="status">Loading your account…</p>}
      {error && (
        <div className="profile-error" role="alert">
          <p>{error}</p>
          <button onClick={() => setReload((value) => value + 1)}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && account && (
        <>
          <section className="profile-section">
            <h2>Account details</h2>
            <dl className="account-details">
              <div>
                <dt>Full name</dt>
                <dd>{account.name}</dd>
              </div>
              <div>
                <dt>Email address</dt>
                <dd>{account.email}</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>{formatDate(account.created_at)}</dd>
              </div>
            </dl>
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <h2>Your orders</h2>
              <span>{orders.length} {orders.length === 1 ? "order" : "orders"}</span>
            </div>
            {orders.length ? (
              <div className="profile-orders">
                {orders.map((order) => (
                  <article className="profile-order" key={order.id}>
                    <div className="profile-order-heading">
                      <div>
                        <span>Order reference</span>
                        <strong>{order.id}</strong>
                      </div>
                      <div>
                        <span>Placed</span>
                        <strong>{formatDate(order.created_at)}</strong>
                      </div>
                      <div>
                        <span>Total</span>
                        <strong>{money(order.total)}</strong>
                      </div>
                    </div>
                    <ul className="profile-order-items">
                      {order.items.map((item, index) => (
                        <li key={`${order.id}-${index}`}>
                          <span>
                            {item.name} · {item.colour} · Size {item.size} ×{" "}
                            {item.quantity}
                          </span>
                          <strong>{money(item.unit_price * item.quantity)}</strong>
                        </li>
                      ))}
                    </ul>
                    <p className="profile-delivery">
                      Delivered to {order.customer} · {order.phone} · {order.address}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="profile-empty">No orders are linked to this account yet.</p>
            )}
          </section>
        </>
      )}
    </section>
  );
}
