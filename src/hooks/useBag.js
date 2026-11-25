import {previewMode} from "../services/api";
import { useEffect, useState } from "react";
const key = previewMode ? "loom-field-preview-bag-v1" : "loom-field-bag-v1";
function restore() {
  try {
    const rows = JSON.parse(localStorage.getItem(key));
    return Array.isArray(rows)
      ? rows.filter(
          (row) =>
            row &&
            Number.isInteger(row.variantId) &&
            Number.isInteger(row.quantity) &&
            row.quantity >= 1 &&
            row.quantity <= 10,
        )
      : [];
  } catch {
    return [];
  }
}
export function useBag() {
  const [bag, setBag] = useState(restore);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(bag));
    } catch {
      /* Bag still works in memory. */
    }
  }, [bag]);
  // Step 5. Keep only size IDs and quantities. The API owns prices and stock.
  function change(variantId, quantity) {
    setBag((previous) => {
      if (!Number.isInteger(variantId)) return previous;
      if (
        quantity !== 0 &&
        (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
      )
        return previous;
      const others = previous.filter((row) => row.variantId !== variantId);
      return quantity > 0 ? [...others, { variantId, quantity }] : others;
    });
  }
  return { bag, change, clear: () => setBag([]) };
}
