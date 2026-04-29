<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

$search_query = isset( $_GET['s'] ) ? sanitize_text_field( wp_unslash( $_GET['s'] ) ) : '';

get_head();
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
