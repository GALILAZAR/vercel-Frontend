# Loom & Field frontend
Open this folder in VS Code. Use Node.js 22.12 or newer.

~~~powershell
# Step 1. Install React and Vite.
npm install
# Step 2. Launch the storefront and open the Local URL printed in the terminal.
npm run dev
~~~

Start reading at src/App.jsx. The pages folder contains the catalog and bag screens, components contains the product card, hooks manages the saved bag, and services chooses the data source. Product photos are in public/images.

The default preview uses twenty bundled clothing products across four collections and three fictional premium labels. Filter by collection, brand, or category, pick a size, add items to your bag, and change quantities. Checkout becomes available when the backend is connected.

The bundled catalog is used for preview during development by default. In production, the frontend uses the API by default; set `VITE_USE_API=false` to force preview mode or `VITE_USE_API=true` to use the API during development.

In production, API requests go to `https://mens-wear-qpt6.vercel.app`. During development, requests use Vite's proxy to the local Express server on port 4000. Set `VITE_API_BASE_URL` to override the backend origin. To use the API locally, create a `.env.local` file beside `package.json` with `VITE_USE_API=true`, then restart Vite. PostgreSQL credentials belong only in the backend configuration.
