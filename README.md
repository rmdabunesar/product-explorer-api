# 🛍️ Product Explorer API

A lightweight, zero-dependency WordPress plugin that fetches products from a REST API and serves them through clean custom URLs — with pagination, search, and single product pages.

---

## ✨ Features

- **Custom URL structure** — `/products`, `/products/{page}`, `/products/{page}/{product_id}`
- **Responsive product grid** — 3 columns on desktop, 2 on tablet, 1 on mobile
- **Smart pagination** — Prev/Next + numbered pages with `…` ellipses
- **URL-based search** — `?s=keyword` with live API querying, no page reload
- **Single product pages** — Image gallery, specs, rating, tags, and back navigation
- **No external dependencies** — Vanilla JS only, no jQuery, no frameworks

---

## 📋 Requirements

| Requirement | Version |
|---|---|
| WordPress | 5.8 or higher |
| PHP | 7.4 or higher |
| Permalink structure | Any (not Plain) |

---

## 🚀 Installation

### Option A — Upload ZIP (Recommended)

1. Go to **Plugins → Add New → Upload Plugin**
2. Upload `products-custom-url-plugin.zip`
3. Click **Install Now**, then **Activate**
4. Visit `/products` on your site ✅

### Option B — Manual FTP/SFTP

1. Upload the `products-custom-url-plugin/` folder to `/wp-content/plugins/`
2. Activate from **Plugins → Installed Plugins**
3. Go to **Settings → Permalinks** and click **Save Changes**

> **Note:** Manual installation requires a one-time permalink flush. The ZIP activation handles this automatically.

---

## 🗂️ File Structure

```
products-custom-url-plugin/
│
├── products-custom-url-plugin.php   # Main plugin file
├── includes/
│   ├── rewrite.php                  # Custom rewrite rules & query vars
│   └── template.php                 # Template override + view generator
└── assets/
    ├── css/
    │   └── style.css                # Responsive styles
    └── js/
        ├── products.js              # List page: fetch, render, paginate, search
        └── single.js                # Single product: fetch, render, gallery
```

---

## 🔗 URL Structure

| URL | Description |
|---|---|
| `/products` | Product list — page 1 |
| `/products/2` | Product list — page 2 |
| `/products/2/45` | Single product ID 45, returning to page 2 |
| `/products/1?s=laptop` | Search results for "laptop" |

---

## 🌐 API Endpoints

All data is fetched client-side from [dummyjson.com](https://dummyjson.com).

| Endpoint | Purpose |
|---|---|
| `GET /products?limit=12&skip=0` | Paginated product list |
| `GET /products/search?q={term}&limit=12&skip=0` | Keyword search |
| `GET /products/{id}` | Single product detail |

---

## 🎨 Customization

### CSS Variables

Override any token from your theme's stylesheet:

```css
:root {
    --pcup-accent:       #2563eb;   /* Primary colour */
    --pcup-bg:           #f8fafc;   /* Page background */
    --pcup-surface:      #ffffff;   /* Card background */
    --pcup-border:       #e2e8f0;   /* Borders */
    --pcup-radius:       12px;      /* Card radius */
}
```

### Products Per Page

In `products-custom-url-plugin.php`, inside `pcup_enqueue_assets`:

```php
'perPage' => 12,  // change to any number
```

---

## ⚙️ How It Works

```
Browser → /products/2/45
    │
    ▼  rewrite.php
    WordPress matches: ^products/([0-9]+)/([0-9]+)/?$
    Sets: pcup_page=2, pcup_product_id=45
    │
    ▼  template.php
    Loads single-product.php (with theme header/footer)
    │
    ▼  single.js
    fetch("https://dummyjson.com/products/45")
    Renders product into #pcup-single-container
```

---

## 🔒 Security

- PHP data passed to JS exclusively via `wp_localize_script`
- User input sanitized with `sanitize_text_field()` + `wp_unslash()`
- JS output escaped via `escHtml()` (encodes `&`, `<`, `>`, `"`, `'`)
- Query vars registered through `query_vars` filter — no raw `$_GET` in templates

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `/products` returns 404 | **Settings → Permalinks → Save Changes** |
| Products not loading | Check browser console; verify dummyjson.com is reachable |
| Styles not applied | Confirm permalink structure is not set to **Plain** |
| Search not working | Check that `?s=` isn't stripped by a caching plugin or `.htaccess` |

---

## 📝 Changelog

### 1.0.0
- Initial release

---

## 📄 License

[GNU General Public License v2.0 or later](https://www.gnu.org/licenses/gpl-2.0.html)
