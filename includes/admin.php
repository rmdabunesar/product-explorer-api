<?php
    if (! defined('ABSPATH')) {
    exit;
    }

    add_action('admin_menu', function () {
    add_menu_page('Update Title', 'Update Title', 'manage_options', 'update-title', 'pea_admin_page', 'dashicons-edit', 20);
    });

    add_action('admin_enqueue_scripts', function ($hook) {
    if ('toplevel_page_update-title' !== $hook) {
        return;
    }

    wp_enqueue_script('pea-admin', PEA_PLUGIN_URL . 'assets/js/admin.js', [], PEA_VERSION, true);
    });

    function pea_admin_page()
{?>
	<div class="wrap">
		<h1>Title: <span id="pea-result"></span></h1>
		
		<form id="pea-form">
			<p>
				<label>Product ID</label><br>
				<input type="number" id="product_id" min="1">
				<button type="button" id="pea-fetch" class="button">Fetch</button>
			</p>
			<p>
				<label>New Title</label><br>
				<input type="text" id="product_title">
			</p>
			<p><button type="submit" class="button button-primary">Update</button></p>
		</form>
		<p id="pea-status"></p>
	</div>
<?php }