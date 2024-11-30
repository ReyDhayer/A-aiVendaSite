function filtrarProdutos() {
    const input = document.getElementById('buscaInput');
    const filter = input.value.toLowerCase();
    const produtos = document.querySelectorAll('.produto-item');

    produtos.forEach(function(produto) {
        const nomeProduto = produto.querySelector('h3').textContent.toLowerCase();
        const descricaoProduto = produto.querySelector('.descricao').textContent.toLowerCase();

        if (nomeProduto.includes(filter) || descricaoProduto.includes(filter)) {
            produto.style.display = '';  // Exibe o produto
        } else {
            produto.style.display = 'none';  // Oculta o produto
        }
    });
}


// Cart state management
let cart = [];
let isCartVisible = false;

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create cart overlay
    const cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    cartOverlay.innerHTML = `
        <div class="cart-content">
            <div class="cart-header">
                <h2>Seu Carrinho</h2>
                <button class="close-cart">&times;</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-total">Total: R$ <span id="cart-total-amount">0.00</span></div>
                <button class="checkout-btn">Finalizar Compra</button>
            </div>
        </div>
    `;
    document.body.appendChild(cartOverlay);

    // Setup cart icon with item count
    const cartIcon = document.querySelector('.Carrinho2');
    const cartCount = document.createElement('span');
    cartCount.className = 'cart-count';
    cartCount.innerText = '0';
    cartIcon.parentElement.appendChild(cartCount);

    // Event Listeners
    document.querySelector('.carrinho').addEventListener('click', toggleCart);
    document.querySelector('.close-cart').addEventListener('click', toggleCart);
    document.querySelectorAll('.btn-comprar').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    document.querySelector('.checkout-btn').addEventListener('click', checkout);
});

// Toggle cart visibility
function toggleCart() {
    const cartOverlay = document.querySelector('.cart-overlay');
    isCartVisible = !isCartVisible;
    cartOverlay.style.display = isCartVisible ? 'flex' : 'none';
}

// Add item to cart
function addToCart(event) {
    const productItem = event.target.closest('.produto-item');
    const product = {
        id: Date.now(), // Unique ID for each cart item
        name: productItem.querySelector('h3').textContent,
        price: parseFloat(productItem.querySelector('.preco').textContent.replace('R$ ', '')),
        image: productItem.querySelector('img').src,
        quantity: 1
    };

    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(product);
    }

    updateCart();
    updateCartCount();
    showAddedToCartNotification();
}

// Update cart display
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        cartItems.appendChild(itemElement);
    });



    
    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', updateQuantity);
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });

    updateTotal();
}

// Update cart total
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total-amount').textContent = total.toFixed(2);
}

// Update quantity
function updateQuantity(event) {
    const id = parseInt(event.target.dataset.id);
    const item = cart.find(item => item.id === id);
    if (event.target.classList.contains('plus')) {
        item.quantity++;
    } else if (event.target.classList.contains('minus') && item.quantity > 1) {
        item.quantity--;
    }
    updateCart();
    updateCartCount();
}

// Remove item from cart
function removeItem(event) {
    const id = parseInt(event.target.dataset.id);
    cart = cart.filter(item => item.id !== id);
    updateCart();
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').innerText = count;
}

// Show added to cart notification
function showAddedToCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Produto adicionado ao carrinho!';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Total do pedido: R$ ${total.toFixed(2)}\nObrigado pela sua compra!`);
    cart = [];
    updateCart();
    updateCartCount();
    toggleCart();
}


const mp = new MercadoPago('TEST-d53994bc-4555-42d1-bb7e-7b6b06340881', {
    locale: 'pt-BR' // Define o idioma para português
});

function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Criar lista de itens para o Mercado Pago
    const items = cart.map(item => ({
        title: item.name,
        quantity: item.quantity,
        currency_id: 'BRL', // Moeda
        unit_price: item.price // Preço unitário
    }));

    // Enviar itens para criar preferência de pagamento
    fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer TEST-1531578128511908-112221-a0572ebc205601b556486f5fbed3b89a-491781231`
        },
        body: JSON.stringify({ items })
    })
    .then(response => response.json())
    .then(data => {
        // Abrir o checkout do Mercado Pago com o ID da preferência
        mp.checkout({
            preference: {
                id: data.id
            },
            autoOpen: true // Abre o checkout automaticamente
        });
    })
    .catch(error => {
        console.error('Erro ao criar preferência:', error);
        alert('Não foi possível processar o pagamento. Tente novamente.');
    });
}
