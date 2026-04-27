/**
 * single.js
 * Fetches and renders a single product on the /products/{page}/{product_id} page.
 * All configuration is injected by wp_localize_script via `peaSingle`.
 */

( function () {
    'use strict';

    /* ── Config from PHP ───────────────────────────────────────────────────── */
    var API_BASE   = peaSingle.apiBase;     // https://dummyjson.com/products
    var PRODUCT_ID = peaSingle.productId;   // integer
    var BACK_URL   = peaSingle.backUrl;     // /products/{page}
    var HOME_URL   = peaSingle.homeUrl;     // /products

    /* ── DOM refs ──────────────────────────────────────────────────────────── */
    var container = document.getElementById( 'pea-single-container' );
    var statusEl  = document.getElementById( 'pea-single-status' );

    /* ── Helpers ───────────────────────────────────────────────────────────── */
    function escHtml( str ) {
        return String( str )
            .replace( /&/g, '&amp;' )
            .replace( /</g, '&lt;' )
            .replace( />/g, '&gt;' )
            .replace( /"/g, '&quot;' )
            .replace( /'/g, '&#039;' );
    }

    function setStatus( html, isError ) {
        statusEl.innerHTML     = html;
        statusEl.style.display = html ? 'flex' : 'none';
        statusEl.classList.toggle( 'pea-status--error', !! isError );
    }

    function formatPrice( price ) {
        return '$' + Number( price ).toFixed( 2 );
    }

    function buildStars( rating ) {
        var score = parseFloat( rating ) || 0;
        var html  = '';
        for ( var i = 1; i <= 5; i++ ) {
            if ( i <= score ) {
                html += '<svg class="pea-star pea-star--full" viewBox="0 0 20 20"><polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"/></svg>';
            } else if ( i - 0.5 <= score ) {
                html += '<svg class="pea-star pea-star--half" viewBox="0 0 20 20"><defs><clipPath id="sh' + i + '"><rect x="0" y="0" width="10" height="20"/></clipPath></defs><polygon class="pea-star__empty" points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"/><polygon class="pea-star__fill" clip-path="url(#sh' + i + ')" points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"/></svg>';
            } else {
                html += '<svg class="pea-star pea-star--empty" viewBox="0 0 20 20"><polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"/></svg>';
            }
        }
        return html;
    }

    /* ── Fetch ─────────────────────────────────────────────────────────────── */
    function fetchProduct() {
        setStatus( '<div class="pea-spinner"></div>' );

        fetch( API_BASE + '/' + PRODUCT_ID )
            .then( function ( res ) {
                if ( ! res.ok ) {
                    throw new Error( 'Product not found (status ' + res.status + ')' );
                }
                return res.json();
            } )
            .then( function ( product ) {
                setStatus( '' );
                renderProduct( product );
            } )
            .catch( function ( err ) {
                setStatus(
                    '<span>⚠️ ' + err.message + '</span>',
                    true
                );
            } );
    }

    /* ── Render ────────────────────────────────────────────────────────────── */
    function renderProduct( p ) {
        var images      = Array.isArray( p.images ) ? p.images : [];
        var thumbnail   = p.thumbnail || ( images[0] || '' );
        var rating      = p.rating ? p.rating.toFixed( 1 ) : '—';
        var stars       = buildStars( p.rating );
        var discount    = p.discountPercentage ? Math.round( p.discountPercentage ) : 0;
        var origPrice   = discount
            ? formatPrice( p.price / ( 1 - discount / 100 ) )
            : '';

        var galHtml = '';
        if ( images.length > 1 ) {
            galHtml = '<div class="pea-gallery">';
            images.forEach( function ( src, idx ) {
                galHtml += '<img src="' + escHtml( src ) + '" alt="' + escHtml( p.title ) + ' image ' + ( idx + 1 ) + '" class="pea-gallery__thumb" loading="lazy" />';
            } );
            galHtml += '</div>';
        }

        var tagsHtml = '';
        if ( Array.isArray( p.tags ) && p.tags.length ) {
            tagsHtml = '<div class="pea-tags">' +
                p.tags.map( function ( t ) {
                    return '<span class="pea-tag">' + escHtml( t ) + '</span>';
                } ).join( '' ) +
                '</div>';
        }

        var detailRows = [
            [ 'Brand',        p.brand ],
            [ 'Category',     p.category ],
            [ 'SKU',          p.sku ],
            [ 'Stock',        p.stock !== undefined ? ( p.stock + ' units' ) : null ],
            [ 'Availability', p.availabilityStatus ],
            [ 'Weight',       p.weight ? p.weight + ' g' : null ],
            [ 'Warranty',     p.warrantyInformation ],
            [ 'Shipping',     p.shippingInformation ],
            [ 'Return Policy', p.returnPolicy ],
        ];

        var detailsHtml = '<dl class="pea-details">';
        detailRows.forEach( function ( row ) {
            if ( row[1] ) {
                detailsHtml += '<div class="pea-details__row"><dt>' + escHtml( row[0] ) + '</dt><dd>' + escHtml( row[1] ) + '</dd></div>';
            }
        } );
        detailsHtml += '</dl>';

        var html =
            '<div class="pea-single">' +

                '<div class="pea-single__back-bar">' +
                    '<a href="' + escHtml( BACK_URL ) + '" id="pea-back-btn" class="pea-back-btn">&#8592; Back to Products</a>' +
                '</div>' +

                '<div class="pea-single__layout">' +

                    '<div class="pea-single__media">' +
                        '<div class="pea-single__hero-wrap">' +
                            ( thumbnail
                                ? '<img id="pea-hero-img" src="' + escHtml( thumbnail ) + '" alt="' + escHtml( p.title ) + '" class="pea-single__hero" />'
                                : '<div class="pea-single__hero pea-single__hero--placeholder"></div>' ) +
                            ( discount ? '<span class="pea-badge pea-badge--lg">-' + discount + '%</span>' : '' ) +
                        '</div>' +
                        galHtml +
                    '</div>' +

                    '<div class="pea-single__info">' +
                        '<span class="pea-single__cat">' + escHtml( p.category || '' ) + '</span>' +
                        '<h1 class="pea-single__title">' + escHtml( p.title ) + '</h1>' +

                        '<div class="pea-single__rating">' +
                            '<span class="pea-stars">' + stars + '</span>' +
                            '<span class="pea-rating-val">' + rating + ' / 5</span>' +
                            ( p.reviews ? '<span class="pea-review-count">(' + p.reviews.length + ' reviews)</span>' : '' ) +
                        '</div>' +

                        '<div class="pea-single__price-wrap">' +
                            '<span class="pea-single__price">' + formatPrice( p.price ) + '</span>' +
                            ( origPrice ? '<span class="pea-single__orig-price">' + origPrice + '</span>' : '' ) +
                            ( discount ? '<span class="pea-badge">' + discount + '% OFF</span>' : '' ) +
                        '</div>' +

                        '<p class="pea-single__desc">' + escHtml( p.description || '' ) + '</p>' +

                        tagsHtml +
                        detailsHtml +

                    '</div>' +

                '</div>' +

            '</div>';

        container.innerHTML = html;

        // Gallery thumbnail click → swap hero image
        var heroImg = document.getElementById( 'pea-hero-img' );
        if ( heroImg ) {
            container.querySelectorAll( '.pea-gallery__thumb' ).forEach( function ( thumb ) {
                thumb.addEventListener( 'click', function () {
                    heroImg.src = thumb.src;
                    container.querySelectorAll( '.pea-gallery__thumb' ).forEach( function ( t ) {
                        t.classList.remove( 'pea-gallery__thumb--active' );
                    } );
                    thumb.classList.add( 'pea-gallery__thumb--active' );
                } );
            } );
        }
    }

    /* ── Init ──────────────────────────────────────────────────────────────── */
    if ( PRODUCT_ID ) {
        fetchProduct();
    } else {
        setStatus( '<span>⚠️ No product ID provided.</span>', true );
    }

} )();
