/**
 * products.js
 * Handles the product list page: fetching, rendering, pagination, and search.
 * All configuration is injected by wp_localize_script via `pcupData`.
 */

( function () {
    'use strict';

    /* ── Config from PHP ───────────────────────────────────────────────────── */
    const API_BASE       = pcupData.apiBase;          // https://dummyjson.com/products
    const SEARCH_BASE    = pcupData.searchApiBase;    // https://dummyjson.com/products/search
    const BASE_URL       = pcupData.baseUrl;          // e.g. https://site.com/products
    const PER_PAGE       = parseInt( pcupData.perPage, 10 );  // 12
    let   currentPage    = parseInt( pcupData.currentPage, 10 );
    let   searchQuery    = pcupData.searchQuery || '';

    /* ── DOM refs ──────────────────────────────────────────────────────────── */
    const grid       = document.getElementById( 'pcup-grid' );
    const pagination = document.getElementById( 'pcup-pagination' );
    const statusEl   = document.getElementById( 'pcup-status' );
    const searchInput = document.getElementById( 'product-search' );
    const searchBtn  = document.getElementById( 'pcup-search-btn' );

    /* ── State ─────────────────────────────────────────────────────────────── */
    let totalProducts = 0;

    /* ── Helpers ───────────────────────────────────────────────────────────── */
    function setStatus( html, isError ) {
        statusEl.innerHTML        = html;
        statusEl.style.display    = html ? 'flex' : 'none';
        statusEl.classList.toggle( 'pcup-status--error', !! isError );
    }

    function buildProductUrl( page, productId ) {
        return BASE_URL + '/' + page + '/' + productId;
    }

    function buildPageUrl( page ) {
        var url = BASE_URL + '/' + page;
        if ( searchQuery ) {
            url += '?s=' + encodeURIComponent( searchQuery );
        }
        return url;
    }

    /* ── Fetch ─────────────────────────────────────────────────────────────── */
    function fetchProducts( page, query ) {
        grid.innerHTML       = '';
        pagination.innerHTML = '';
        setStatus( '<div class="pcup-spinner"></div>' );

        var skip = ( page - 1 ) * PER_PAGE;
        var url;

        if ( query ) {
            url = SEARCH_BASE + '?q=' + encodeURIComponent( query ) +
                  '&limit=' + PER_PAGE + '&skip=' + skip;
        } else {
            url = API_BASE + '?limit=' + PER_PAGE + '&skip=' + skip;
        }

        fetch( url )
            .then( function ( res ) {
                if ( ! res.ok ) {
                    throw new Error( 'Network error: ' + res.status );
                }
                return res.json();
            } )
            .then( function ( data ) {
                totalProducts = data.total || 0;
                setStatus( '' );
                renderGrid( data.products || [], page );
                renderPagination( page, Math.ceil( totalProducts / PER_PAGE ) );
            } )
            .catch( function ( err ) {
                setStatus(
                    '<span>⚠️ Failed to load products. ' + err.message + '</span>',
                    true
                );
            } );
    }

    /* ── Render grid ───────────────────────────────────────────────────────── */
    function renderGrid( products, page ) {
        if ( ! products.length ) {
            grid.innerHTML = '<p class="pcup-empty">No products found.</p>';
            return;
        }

        var fragment = document.createDocumentFragment();

        products.forEach( function ( product ) {
            var card       = document.createElement( 'article' );
            card.className = 'pcup-card';

            var rating     = product.rating ? product.rating.toFixed( 1 ) : '—';
            var stars      = buildStars( product.rating );
            var discount   = product.discountPercentage
                ? '<span class="pcup-badge">-' + Math.round( product.discountPercentage ) + '%</span>'
                : '';

            card.innerHTML =
                '<a href="' + buildProductUrl( page, product.id ) + '" class="pcup-card__link" aria-label="View ' + escHtml( product.title ) + '">' +
                    '<div class="pcup-card__img-wrap">' +
                        ( product.thumbnail
                            ? '<img src="' + escHtml( product.thumbnail ) + '" alt="' + escHtml( product.title ) + '" class="pcup-card__img" loading="lazy" />'
                            : '<div class="pcup-card__img-placeholder"></div>' ) +
                        discount +
                    '</div>' +
                    '<div class="pcup-card__body">' +
                        '<span class="pcup-card__cat">' + escHtml( product.category || '' ) + '</span>' +
                        '<h2 class="pcup-card__title">' + escHtml( product.title ) + '</h2>' +
                        '<div class="pcup-card__rating">' +
                            '<span class="pcup-stars" aria-label="Rating: ' + rating + ' out of 5">' + stars + '</span>' +
                            '<span class="pcup-rating-val">(' + rating + ')</span>' +
                        '</div>' +
                        '<div class="pcup-card__footer">' +
                            '<span class="pcup-card__price">$' + Number( product.price ).toFixed( 2 ) + '</span>' +
                            '<span class="pcup-card__cta">View →</span>' +
                        '</div>' +
                    '</div>' +
                '</a>';

            fragment.appendChild( card );
        } );

        grid.appendChild( fragment );
    }

    function buildStars( rating ) {
        var score = parseFloat( rating ) || 0;
        var html  = '';
        for ( var i = 1; i <= 5; i++ ) {
            if ( i <= score ) {
                html += '<svg class="pcup-star pcup-star--full" viewBox="0 0 20 20"><polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"/></svg>';
            } else if ( i - 0.5 <= score ) {
                html += '<svg class="pcup-star pcup-star--half" viewBox="0 0 20 20"><defs><clipPath id="half' + i + '"><rect x="0" y="0" width="10" height="20"/></clipPath></defs><polygon class="pcup-star__empty" points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"/><polygon class="pcup-star__fill" clip-path="url(#half' + i + ')" points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"/></svg>';
            } else {
                html += '<svg class="pcup-star pcup-star--empty" viewBox="0 0 20 20"><polygon points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"/></svg>';
            }
        }
        return html;
    }

    /* ── Render pagination ─────────────────────────────────────────────────── */
    function renderPagination( current, total ) {
        if ( total <= 1 ) {
            pagination.innerHTML = '';
            return;
        }

        var pages = buildPageRange( current, total );
        var html  = '';

        html += '<button class="pcup-page-btn pcup-page-btn--nav" ' +
                    ( current <= 1 ? 'disabled' : '' ) +
                    ' data-page="' + ( current - 1 ) + '" aria-label="Previous page">&#8592; Prev</button>';

        pages.forEach( function ( p ) {
            if ( p === '...' ) {
                html += '<span class="pcup-page-ellipsis">…</span>';
            } else {
                var active = p === current ? ' pcup-page-btn--active' : '';
                var aria   = p === current ? ' aria-current="page"' : '';
                html += '<button class="pcup-page-btn' + active + '"' + aria +
                            ' data-page="' + p + '">' + p + '</button>';
            }
        } );

        html += '<button class="pcup-page-btn pcup-page-btn--nav" ' +
                    ( current >= total ? 'disabled' : '' ) +
                    ' data-page="' + ( current + 1 ) + '" aria-label="Next page">Next &#8594;</button>';

        pagination.innerHTML = html;

        pagination.querySelectorAll( '.pcup-page-btn:not([disabled])' ).forEach( function ( btn ) {
            btn.addEventListener( 'click', function () {
                var page = parseInt( btn.dataset.page, 10 );
                navigateToPage( page );
            } );
        } );
    }

    /**
     * Smart page range: always show first, last, current ±1, with ellipses.
     */
    function buildPageRange( current, total ) {
        var delta = 1;
        var range = [];
        var rangeWithDots = [];
        var l;

        for ( var i = 1; i <= total; i++ ) {
            if ( i === 1 || i === total || ( i >= current - delta && i <= current + delta ) ) {
                range.push( i );
            }
        }

        range.forEach( function ( i ) {
            if ( l !== undefined ) {
                if ( i - l === 2 ) {
                    rangeWithDots.push( l + 1 );
                } else if ( i - l !== 1 ) {
                    rangeWithDots.push( '...' );
                }
            }
            rangeWithDots.push( i );
            l = i;
        } );

        return rangeWithDots;
    }

    /* ── Navigation ────────────────────────────────────────────────────────── */
    function navigateToPage( page ) {
        var url = buildPageUrl( page );
        history.pushState( { page: page, query: searchQuery }, '', url );
        currentPage = page;
        fetchProducts( page, searchQuery );
        window.scrollTo( { top: 0, behavior: 'smooth' } );
    }

    /* ── Search ────────────────────────────────────────────────────────────── */
    function doSearch() {
        searchQuery = searchInput ? searchInput.value.trim() : '';
        currentPage = 1;
        var url = BASE_URL + '/1';
        if ( searchQuery ) {
            url += '?s=' + encodeURIComponent( searchQuery );
        }
        history.pushState( { page: 1, query: searchQuery }, '', url );
        fetchProducts( 1, searchQuery );
    }

    if ( searchInput ) {
        searchInput.addEventListener( 'keydown', function ( e ) {
            if ( e.key === 'Enter' ) {
                doSearch();
            }
        } );
    }

    if ( searchBtn ) {
        searchBtn.addEventListener( 'click', doSearch );
    }

    /* ── Browser back/forward ──────────────────────────────────────────────── */
    window.addEventListener( 'popstate', function ( e ) {
        if ( e.state && e.state.page ) {
            currentPage  = e.state.page;
            searchQuery  = e.state.query || '';
            if ( searchInput ) {
                searchInput.value = searchQuery;
            }
            fetchProducts( currentPage, searchQuery );
        }
    } );

    /* ── XSS helper ────────────────────────────────────────────────────────── */
    function escHtml( str ) {
        return String( str )
            .replace( /&/g, '&amp;' )
            .replace( /</g, '&lt;' )
            .replace( />/g, '&gt;' )
            .replace( /"/g, '&quot;' )
            .replace( /'/g, '&#039;' );
    }

    /* ── Init ──────────────────────────────────────────────────────────────── */
    fetchProducts( currentPage, searchQuery );

} )();
