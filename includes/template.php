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

// ── Create view directory & stubs on the fly ───────────────────────────────────
// The view files live as separate PHP files inside includes/views/ so they can
// call get_header() / get_footer() and integrate with any theme.

add_action( 'after_setup_theme', 'pea_create_view_files' );

function pea_create_view_files() {
    $views_dir = PEA_PLUGIN_DIR . 'includes/views/';

    if ( ! is_dir( $views_dir ) ) {
        wp_mkdir_p( $views_dir );
    }

    // ── Product list view ──────────────────────────────────────────────────────
    $list_file = $views_dir . 'product-list.php';
    if ( ! file_exists( $list_file ) ) {
        $list_content = <<<'PHP'
<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

$search_query = isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '';

get_header();
?>
<div class="pea-wrap">
    <div class="pea-header">
        <h1 class="pea-title">Our Products</h1>
        <div class="pea-search-wrap">
            <input
                type="text"
                id="product-search"
                class="pea-search-input"
                placeholder="Search products…"
                value="<?php echo esc_attr( $search_query ); ?>"
                autocomplete="off"
            />
            <button id="pea-search-btn" class="pea-search-btn" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
        </div>
    </div>

    <div id="pea-status" class="pea-status" role="status" aria-live="polite"></div>

    <div id="pea-grid" class="pea-grid" aria-label="Product list"></div>

    <nav id="pea-pagination" class="pea-pagination" aria-label="Product pagination"></nav>
</div>
<?php get_footer(); ?>
PHP;
        file_put_contents( $list_file, $list_content ); // phpcs:ignore WordPress.WP.AlternativeFunctions
    }

    // ── Single product view ────────────────────────────────────────────────────
    $single_file = $views_dir . 'single-product.php';
    if ( ! file_exists( $single_file ) ) {
        $single_content = <<<'PHP'
<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
?>
<div class="pea-wrap">
    <div id="pea-single-container" class="pea-single-container">
        <div id="pea-single-status" class="pea-status" role="status" aria-live="polite">
            <div class="pea-spinner"></div>
        </div>
    </div>
</div>
<?php get_footer(); ?>
PHP;
        file_put_contents( $single_file, $single_content ); // phpcs:ignore WordPress.WP.AlternativeFunctions
    }
}
