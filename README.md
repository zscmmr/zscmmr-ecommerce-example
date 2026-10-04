# ZSCMMR E-commerce Demo

A responsive streetwear storefront demo featuring a product catalog, product detail pages, a browser-based preview cart, a checkout preview, and a four-image gallery.

## Pages

- `index.html` — home page
- `featured.html` — shop catalog
- `product.html` — product details; choose a product through the URL, for example `product.html?product=hoodie-1`
- `cart.html` — preview cart
- `checkout.html` — checkout preview
- `gallery.html` and `gallery-moment.html` — gallery and moment details

The cart is stored in the browser's `localStorage`. Product details and prices are sample data.

## Run locally

Install [Node.js](https://nodejs.org/), then run this command from the project root:

```sh
node preview-server.js
```

Open <http://127.0.0.1:4173>.

Alternatively, serve the project root with any static web server. Opening the HTML files directly may limit browser storage and other browser features.

## Deploy with GitHub Pages

1. Create a GitHub repository and upload the contents of this `github-pages` folder to the repository root.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing the site (usually `main`) and the `/ (root)` folder, then save.
5. Wait for deployment to finish, then open the URL shown in the Pages settings.

This folder contains the static HTML demo prepared for GitHub Pages. It does not include the separate PHP/WordPress theme because GitHub Pages does not run PHP, WordPress, or WooCommerce.

## Demo limitations

- This is an e-commerce demo, not a production store.
- Checkout and the **Pay now** button do not process payments or create orders.
- Cart prices and totals are not calculated; catalog prices are examples.
- Do not enter real customer or payment information in this demo.

## Contact

Use the **Contact** link in the site footer to email [nexbyte.wrld@gmail.com](mailto:nexbyte.wrld@gmail.com).
