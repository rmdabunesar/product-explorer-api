<?php
/**
 * Template handling for the Products Custom URL Plugin.
 *
 * Intercepts WordPress template loading when our custom query vars are set
 * and outputs the appropriate HTML shell (list or single) into the active theme's
 * page template so the site header/footer are preserved.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ── Intercept template loading ─────────────────────────────────────────────────
add_filter( 'template_include', 'pea_template_include' );

function pea_template_include( $template ) {
    if ( ! get_query_var( 'pea_products', false ) ) {
        return $template;
    }

    $product_id = get_query_var( 'pea_product_id', '' );

    if ( ! empty( $product_id ) ) {
        return PEA_PLUGIN_DIR . 'includes/views/single-product.php';
    }

    return PEA_PLUGIN_DIR . 'includes/views/product-list.php';
}

// ── Document title ─────────────────────────────────────────────────────────────
add_filter( 'document_title_parts', 'pea_document_title' );

function pea_document_title( $title ) {
    if ( ! get_query_var( 'pea_products', false ) ) {
        return $title;
    }

    $product_id = get_query_var( 'pea_product_id', '' );

    if ( ! empty( $product_id ) ) {
        $title['title'] = __( 'Product Detail', 'products-custom-url' );
    } else {
        $page = (int) get_query_var( 'pea_page', 1 );
        /* translators: %d: page number */
        $title['title'] = $page > 1
            ? sprintf( __( 'Products – Page %d', 'products-custom-url' ), $page )
            : __( 'Products', 'products-custom-url' );
    }

    return $title;
}
