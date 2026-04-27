# 🛍️ Product Explorer API

A lightweight, zero-dependency WordPress plugin that fetches products from a REST API and serves them through clean custom URLs — with pagination, search, and single product pages.

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

# WordPress PHP HTTP API — GET, POST, PUT, PATCH, DELETE

A complete guide to making HTTP requests in WordPress using `wp_remote_request()` with real examples using [DummyJSON](https://dummyjson.com).

---

## Table of Contents

- [GET](#get)
- [POST](#post)
- [PUT](#put)
- [PATCH](#patch)
- [DELETE](#delete)
- [Quick Reference](#quick-reference)

---

## GET

Fetch / read data from an API.

```php
<?php
function wp_api_get($url, $headers = []) {
    $response = wp_remote_request($url, [
        'method'  => 'GET',
        'headers' => array_merge(['Content-Type' => 'application/json'], $headers),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }

    return [
        'status' => wp_remote_retrieve_response_code($response),
        'data'   => json_decode(wp_remote_retrieve_body($response), true),
    ];
}

// ✅ Example 1 — Fetch single product
$result = wp_api_get('https://dummyjson.com/products/1');
print_r($result['data']);

// ✅ Example 2 — Fetch all products
$result = wp_api_get('https://dummyjson.com/products');
print_r($result['data']);

// ✅ Example 3 — Fetch with query params
$result = wp_api_get('https://dummyjson.com/products?limit=5&skip=10');
print_r($result['data']);
```

---

## POST

Create a new resource.

```php
<?php
function wp_api_post($url, $data = [], $headers = []) {
    $response = wp_remote_request($url, [
        'method'  => 'POST',
        'headers' => array_merge(['Content-Type' => 'application/json'], $headers),
        'body'    => json_encode($data),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }

    return [
        'status' => wp_remote_retrieve_response_code($response),
        'data'   => json_decode(wp_remote_retrieve_body($response), true),
    ];
}

// ✅ Example 1 — Add a new product
$result = wp_api_post('https://dummyjson.com/products/add', [
    'title'       => 'New Laptop',
    'price'       => 999.99,
    'description' => 'A brand new laptop',
    'category'    => 'electronics',
]);
print_r($result['data']);

// ✅ Example 2 — Login
$result = wp_api_post('https://dummyjson.com/auth/login', [
    'username' => 'emilys',
    'password' => 'emilyspass',
]);
print_r($result['data']); // Returns token

// ✅ Example 3 — Add a new user
$result = wp_api_post('https://dummyjson.com/users/add', [
    'firstName' => 'John',
    'lastName'  => 'Doe',
    'email'     => 'john@example.com',
    'age'       => 30,
]);
print_r($result['data']);
```

---

## PUT

Replace the full resource (all fields).

```php
<?php
function wp_api_put($url, $data = [], $headers = []) {
    $response = wp_remote_request($url, [
        'method'  => 'PUT',
        'headers' => array_merge(['Content-Type' => 'application/json'], $headers),
        'body'    => json_encode($data),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }

    return [
        'status' => wp_remote_retrieve_response_code($response),
        'data'   => json_decode(wp_remote_retrieve_body($response), true),
    ];
}

// ✅ Example 1 — Replace full product
$result = wp_api_put('https://dummyjson.com/products/1', [
    'title'       => 'iPhone Galaxy +1',
    'price'       => 1299.99,
    'description' => 'Fully replaced product data',
    'category'    => 'smartphones',
]);
print_r($result['data']);

// ✅ Example 2 — Replace full user
$result = wp_api_put('https://dummyjson.com/users/1', [
    'firstName' => 'James',
    'lastName'  => 'Smith',
    'email'     => 'james@example.com',
    'age'       => 25,
]);
print_r($result['data']);

// ✅ Example 3 — Replace full cart
$result = wp_api_put('https://dummyjson.com/carts/1', [
    'merge'  => true,
    'userId' => 1,
    'products' => [
        ['id' => 1, 'quantity' => 2],
        ['id' => 2, 'quantity' => 1],
    ],
]);
print_r($result['data']);
```

---

## PATCH

Update only specific fields of a resource.

```php
<?php
function wp_api_patch($url, $data = [], $headers = []) {
    $response = wp_remote_request($url, [
        'method'  => 'PATCH',
        'headers' => array_merge(['Content-Type' => 'application/json'], $headers),
        'body'    => json_encode($data),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }

    return [
        'status' => wp_remote_retrieve_response_code($response),
        'data'   => json_decode(wp_remote_retrieve_body($response), true),
    ];
}

// ✅ Example 1 — Update only product title
$result = wp_api_patch('https://dummyjson.com/products/1', [
    'title' => 'iPhone Galaxy +1',
]);
print_r($result['data']);

// ✅ Example 2 — Update only price
$result = wp_api_patch('https://dummyjson.com/products/1', [
    'price' => 149.99,
]);
print_r($result['data']);

// ✅ Example 3 — Update only user email
$result = wp_api_patch('https://dummyjson.com/users/1', [
    'email' => 'newemail@example.com',
]);
print_r($result['data']);
```

---

## DELETE

Remove a resource.

```php
<?php
function wp_api_delete($url, $headers = []) {
    $response = wp_remote_request($url, [
        'method'  => 'DELETE',
        'headers' => array_merge(['Content-Type' => 'application/json'], $headers),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }

    return [
        'status' => wp_remote_retrieve_response_code($response),
        'data'   => json_decode(wp_remote_retrieve_body($response), true),
    ];
}

// ✅ Example 1 — Delete a product
$result = wp_api_delete('https://dummyjson.com/products/1');
print_r($result['data']);

// ✅ Example 2 — Delete a user
$result = wp_api_delete('https://dummyjson.com/users/1');
print_r($result['data']);

// ✅ Example 3 — Delete a cart
$result = wp_api_delete('https://dummyjson.com/carts/1');
print_r($result['data']);
```

---

## Quick Reference

| Function           | Method   | Purpose                      |
|--------------------|----------|------------------------------|
| `wp_api_get()`     | `GET`    | Fetch / read data            |
| `wp_api_post()`    | `POST`   | Create new resource          |
| `wp_api_put()`     | `PUT`    | Replace full resource        |
| `wp_api_patch()`   | `PATCH`  | Update partial fields only   |
| `wp_api_delete()`  | `DELETE` | Remove a resource            |

---

## Notes

- All functions use WordPress built-in `wp_remote_request()` — no cURL needed.
- Always use `is_wp_error()` to catch connection errors.
- Use `wp_remote_retrieve_response_code()` to check the HTTP status code.
- Use `wp_remote_retrieve_body()` to get the raw response body.
- **PUT** replaces the entire resource. **PATCH** updates only the fields you send.
- These functions work inside `functions.php`, plugins, or any WordPress PHP file.

---

## Requirements

- WordPress 4.6+
- PHP 7.4+
- Active internet connection for external API calls
