(function () {
    "use strict";

    const form = document.getElementById("pea-form");
    const idField = document.getElementById("product_id");
    const titleField = document.getElementById("product_title");
    const result = document.getElementById("pea-result");   
    const statusEl = document.getElementById("pea-status"); 

    if (!form) return;

    const base_url = "https://dummyjson.com/products/";

    function status(msg) {
        statusEl.textContent = msg;
    }

    // Fetch product title
    document.getElementById("pea-fetch").addEventListener("click", function () {
        const id = parseInt(idField.value);
        if (!id) return status("Enter a valid ID.");

        status("Loading...");

        fetch(base_url + id)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            result.textContent = data.title;  
            status("Loaded.");
        })
        .catch(function () {
            status("Load failed.");
        });
    });

    // Update product title
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = parseInt(idField.value);
        const title = titleField.value.trim();
        if (!id || !title) return status("Enter ID and title.");

        status("Updating...");

        fetch(base_url + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            result.textContent = data.title;  
            status("Updated");
        })
        .catch(function () {
            status("Update failed.");
        });
    });
})();