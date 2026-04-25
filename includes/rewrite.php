<?php
/**
 * Custom rewrite rules for the Products Custom URL Plugin.
 *
 * URL patterns handled:
 *   /products                       → product list (page 1)
 *   /products/{page}                → product list (paginated)
 *   /products/{page}/{product_id}   → single product view
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ── Register rewrite rules ─────────────────────────────────────────────────────
add_action( 'init', 'pea_register_rewrite_rules' );

function pea_register_rewrite_rules() {
    // Rule 1: /products/{page}/{product_id}  →  single product
    add_rewrite_rule(
        '^products/([0-9]+)/([0-9]+)/?$',
        'index.php?pea_products=1&pea_page=$matches[1]&pea_product_id=$matches[2]',
        'top'
    );

    // Rule 2: /products/{page}  →  paginated list
    add_rewrite_rule(
        '^products/([0-9]+)/?$',
        'index.php?pea_products=1&pea_page=$matches[1]',
        'top'
    );

    // Rule 3: /products  →  list page 1
    add_rewrite_rule(
        '^products/?$',
        'index.php?pea_products=1&pea_page=1',
        'top'
    );
}

// ── Register custom query vars ─────────────────────────────────────────────────
add_filter( 'query_vars', 'pea_register_query_vars' );

function pea_register_query_vars( $vars ) {
    $vars[] = 'pea_products';
    $vars[] = 'pea_page';
    $vars[] = 'pea_product_id';
    return $vars;
}
