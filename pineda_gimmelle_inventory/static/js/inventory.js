function add() {
    const name = $('#name').val().trim();
    const quantity = $('#quantity').val().trim();
    const price = $('#price').val().trim();
    const unit = $('#unit').val().trim();
    
    // Enhanced input validation
    if (!name || !quantity || !price || !unit) {
        alert('Please fill in all fields');
        return;
    }
    
    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);
    
    if (isNaN(quantityNum) || quantityNum < 0 || !Number.isInteger(quantityNum)) {
        alert('Please enter a valid whole number for quantity');
        return;
    }
    
    if (isNaN(priceNum) || priceNum < 0) {
        alert('Please enter a valid price');
        return;
    }

    // Sanitize data before sending
    const productData = {
        name: name.substring(0, 100), // Limit name length
        quantity: Math.floor(quantityNum), // Ensure integer
        price: Number(priceNum.toFixed(2)), // Format price to 2 decimals
        unit: unit.substring(0, 20) // Limit unit length
    };

    $.ajax({
        url: '/add-products',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(productData),
        success: function(response) {
            if (response.success) {
                // Clear form and reload products
                $('#name, #quantity, #price, #unit').val('');
                loadProducts();
                alert(response.message);
            } else {
                alert(response.message || "Error adding product");
            }
        },
        error: function(xhr, status, error) {
            if (!checkAuthorization(xhr)) return;
            
            let errorMessage = 'Error adding product: ';
            try {
                const response = JSON.parse(xhr.responseText);
                errorMessage += response.error || error;
            } catch (e) {
                errorMessage += error;
            }
            console.error('Add product error:', error);
            alert(errorMessage);
        }
    }); 
}
function loadProducts() {
    $.ajax({
        url: '/get_products',
        type: 'GET',
        success: function(products) {
            let tbody = '';
            if (products && products.length > 0) {
                products.forEach(product => {
                    tbody += `
                        <tr>
                            <td>${product[0]}</td>
                            <td>${product[1]}</td>
                            <td>${product[2]}</td>
                            <td>${product[3]}</td>
                            <td>₱${product[4].toLocaleString()}</td>
                            <td>
                                <button class="btn bbtn btn-warning" onclick="editProduct(${product[0]})">Edit</button>
                                <button class="btn bbtn btn-danger" onclick="deleteProduct(${product[0]})">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            } else {
                tbody = `
                    <tr>
                        <td colspan="6" class="text-center">No Products inserted</td>
                    </tr>
                `;
            }
            $('tbody').html(tbody);
        },
        error: function(xhr, status, error) {
            alert('Error loading products: ' + error);
        }
    });
}

$(document).ready(function() {
    loadProducts();
});

function editProduct(id) {
    $.ajax({
        url: '/get-product/' + id,
        type: 'GET',
        success: function(product) {

            $('#edit_product_id').val(id);
            $('#edit_name').val(product.name);
            $('#edit_quantity').val(product.quantity);
            $('#edit_unit').val(product.unit);
            $('#edit_price').val(product.price);
            
            var editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.show();
        },
        error: function(xhr, status, error) {
            alert('Error loading product: ' + error);
        }
    });
}

function updateProduct() {
    const data = {
        product_id: $('#edit_product_id').val(),
        name: $('#edit_name').val(),
        quantity: $('#edit_quantity').val(),
        unit: $('#edit_unit').val(),
        price: $('#edit_price').val()
    };

    $.ajax({
        url: '/update-product',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            if (response.success) {
                var editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                editModal.hide();
                
                alert(response.message);
                loadProducts();
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            alert('Error updating product: ' + error);
        }
    });
}
function addModalStyles() {
    const style = `
        .modal-content {
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }
        .modal-header {
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
        }
        .modal-body {
            color: #ffffff;
        }
        .modal-footer {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        .form-control {
            height: 3.5rem;
            background-color: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            color: #ffffff;
            padding: 0 1.5rem;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }
        .form-control::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        .form-control:focus {
            background-color: rgba(255, 255, 255, 0.2);
            border-color: #3498db;
            box-shadow: 0 0 15px rgba(52, 152, 219, 0.3);
            outline: none;
        }
        .modal-title {
            color: #ffffff;
            font-weight: 600;
        }
        .btn-close {
            color: #ffffff;
            filter: invert(1) grayscale(100%) brightness(200%);
        }
            .btn-success {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
    background: linear-gradient(45deg,rgb(1, 74, 18), rgb(94, 206, 135);
}
    .btn-success:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
    background: linear-gradient(45deg, #dcd503, #879006);
}
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);
}

$(document).ready(function() {
    addModalStyles();
    loadProducts();
});
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        $.ajax({
            url: '/delete-product',  
            type: 'POST',          
            contentType: 'application/json',
            data: JSON.stringify({ product_id: id }),
            success: function(response) {
                if (response.success) {
                    alert(response.message);
                    loadProducts();  
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                alert('Error deleting product: ' + error);
            }
        });
    }
}
function exportProducts() {
    try {
        window.location.href = '/export-products';
    } catch (error) {
        alert('Error exporting products: ' + error);
    }
}
function logout() {
    if(confirm('Are you sure you want to logout?')) {
        $.ajax({
            url: '/logout',
            type: 'POST',
            success: function(response) {
                if(response.success) {
                    window.location.href = '/';
                }
            },
            error: function(xhr, status, error) {
                alert('Error logging out: ' + error);
            }
        });
    }
}
$(document).ready(function() {
    $('#search').on('keyup', function() {
        const searchTerm = $(this).val();
        searchProducts(searchTerm);
    });
});

function searchProducts(term) {
    $.ajax({
        url: '/search-products',
        type: 'GET',
        data: { term: term },
        success: function(response) {
            if (response.success) {
                if (response.products.length === 0) {
                    $('tbody').html('<tr><td colspan="6" class="text-center">No products found</td></tr>');
                } else {
                    updateProductTable(response.products);
                }
            }
        },
        error: function(xhr, status, error) {
            if (!checkAuthorization(xhr)) return;
            console.error('Search error:', error);
        }
    });
}

function updateProductTable(products) {
    let tbody = '';
    products.forEach(product => {
        tbody += `
            <tr>
                <td>${product[0]}</td>
                <td>${product[1]}</td>
                <td>${product[2]}</td>
                <td>${product[3]}</td>
                <td>₱${product[4].toLocaleString()}</td>
                <td>
                    <button onclick="editProduct(${product[0]})" class="btn bbtn btn-warning">Edit</button>
                    <button onclick="deleteProduct(${product[0]})" class="btn bbtn btn-danger">Delete</button>
                </td>
            </tr>
        `;
    });
    $('tbody').html(tbody);
}
function checkAuthorization(xhr) {
    if (xhr.status === 401) {
        alert('Your session has expired. Please login again.');
        window.location.href = '/';
        return false;
    }
    return true;
}