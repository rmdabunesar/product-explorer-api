# 🛍️ Product Explorer API

A lightweight, zero-dependency WordPress plugin that fetches products from a REST API and serves them through clean custom URLs — with pagination, search, and single product pages.

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

A complete guide to making HTTP requests in WordPress using `wp_remote_request()` with real examples using [DummyJSON](https://dummyjson.com/products).

---

## Setup — just change these 3 values

```php
    $site_url     = 'https://yoursite.com';
    $username     = 'admin';
    $app_password = 'xxxx xxxx xxxx xxxx';

    $base_url = $site_url . '/wp-json/wp/v2/';
    $auth     = 'Basic ' . base64_encode("$username:$app_password");
```

---

## GET

```php
   $response = wp_remote_request($base_url . 'posts/1', [
        'method'  => 'GET',
        'headers' => ['Authorization' => $auth],
    ]);

    $post = json_decode(wp_remote_retrieve_body($response), true);
    print_r($post);
```

---

## POST

```php
    $response = wp_remote_request($base_url . 'posts', [
        'method'  => 'POST',
        'headers' => ['Content-Type' => 'application/json', 'Authorization' => $auth],
        'body'    => json_encode([
            'title'   => 'My New Post',
            'content' => 'Hello World!',
            'status'  => 'publish',
        ]),
    ]);

    $post = json_decode(wp_remote_retrieve_body($response), true);
    print_r($post);
```

---

## PUT

```php
    $response = wp_remote_request($base_url . 'posts/1', [
        'method'  => 'PUT',
        'headers' => ['Content-Type' => 'application/json', 'Authorization' => $auth],
        'body'    => json_encode([
            'title'   => 'Updated Title',
            'content' => 'Updated content.',
            'status'  => 'publish',
        ]),
    ]);

    $post = json_decode(wp_remote_retrieve_body($response), true);
    print_r($post);
```

---

## PATCH

```php
// ─── PATCH ────────────────────────────────────────────────────────────────
$response = wp_remote_request($base_url . 'posts/1', [
    'method'  => 'PATCH',
    'headers' => ['Content-Type' => 'application/json', 'Authorization' => $auth],
    'body'    => json_encode([
        'title' => 'Only Title Updated',
    ]),
]);

$post = json_decode(wp_remote_retrieve_body($response), true);
print_r($post);
```

---

## DELETE

```php
    $response = wp_remote_request($base_url . 'posts/1?force=true', [
        'method'  => 'DELETE',
        'headers' => ['Authorization' => $auth],
    ]);

    $post = json_decode(wp_remote_retrieve_body($response), true);
    print_r($post);
```
