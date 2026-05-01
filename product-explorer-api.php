<?php
/**
 * Plugin Name:       Product Explorer API
 * Plugin URI:        https://github.com/rmdabunesar/product-explorer-api
 * Description:       Displays products from dummyjson.com with custom URL structure, pagination, search, and single product pages.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Abu Nesar
 * Author URI:        https://github.com/rmdabunesar
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       product-explorer-api
 */


/**
 * Show current template file in WordPress admin top bar
 */
add_action( 'admin_bar_menu', 'pea_show_template_in_admin_bar', 100 );

function pea_show_template_in_admin_bar( $wp_admin_bar ) {

    if ( is_admin() ) {
        return;
    }

    global $template;

    $wp_admin_bar->add_node( array(
        'id'    => 'pea-template-file',
        'title' => 'Template: ' . basename( $template ),
        'href'  => false,
    ) );
}


if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ── Constants ──────────────────────────────────────────────────────────────────
define( 'PEA_VERSION',     '1.0.0' );
define( 'PEA_PLUGIN_DIR',  plugin_dir_path( __FILE__ ) );
define( 'PEA_PLUGIN_URL',  plugin_dir_url( __FILE__ ) );

// ── Core includes ──────────────────────────────────────────────────────────────
require_once PEA_PLUGIN_DIR . 'includes/rewrite.php';
require_once PEA_PLUGIN_DIR . 'includes/template.php';
require_once PEA_PLUGIN_DIR . 'includes/admin.php';

// ── Activation / Deactivation hooks ───────────────────────────────────────────
register_activation_hook( __FILE__, 'pea_activate' );
register_deactivation_hook( __FILE__, 'pea_deactivate' );

function pea_activate() {
    pea_register_rewrite_rules();
    flush_rewrite_rules();
}

function pea_deactivate() {
    flush_rewrite_rules();
}

// ── Enqueue assets ─────────────────────────────────────────────────────────────
add_action( 'wp_enqueue_scripts', 'pea_enqueue_assets' );

function pea_enqueue_assets() {
    // Only load on our virtual /products/* pages
    if ( ! get_query_var( 'pea_products', false ) && ! get_query_var( 'pea_page', false ) ) {
        return;
    }

    $product_id = get_query_var( 'pea_product_id', '' );
    $is_single  = ! empty( $product_id );

    // Shared stylesheet
    wp_enqueue_style(
        'pea-style',
        PEA_PLUGIN_URL . 'assets/css/style.css',
        [],
        PEA_VERSION
    );

    if ( $is_single ) {
        // Single product JS
        wp_enqueue_script(
            'pea-single',
            PEA_PLUGIN_URL . 'assets/js/single.js',
            [],
            PEA_VERSION,
            true
        );

        $page = (int) get_query_var( 'pea_page', 1 );

        wp_localize_script( 'pea-single', 'peaSingle', [
            'apiBase'    => 'https://dummyjson.com/products',
            'productId'  => (int) $product_id,
            'backUrl'    => home_url( '/products/' . $page ),
            'homeUrl'    => home_url( '/products' ),
        ] );

    } else {
        // Product list JS
        wp_enqueue_script(
            'pea-products',
            PEA_PLUGIN_URL . 'assets/js/products.js',
            [],
            PEA_VERSION,
            true
        );

        $current_page = (int) get_query_var( 'pea_page', 1 );
        $search       = isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '';

        wp_localize_script( 'pea-products', 'peaData', [
            'apiBase'        => 'https://dummyjson.com/products',
            'searchApiBase'  => 'https://dummyjson.com/products/search',
            'baseUrl'        => home_url( '/products' ),
            'currentPage'    => $current_page,
            'perPage'        => 12,
            'searchQuery'    => $search,
        ] );
    }
}
