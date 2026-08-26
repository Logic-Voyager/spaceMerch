const bar = document.getElementById('bar');
const close = document.getElementById('close');
const navbar = document.getElementById('navbar');
const cartKey = 'enigma-cart';

function getCart() {
    return JSON.parse(localStorage.getItem(cartKey) || '[]');
}

function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

function productFromCard(card) {
    return {
        name: card.querySelector('h5')?.textContent.trim() || 'Space merchandise',
        brand: card.querySelector('.des span')?.textContent.trim() || 'Enigma',
        price: Number.parseFloat(card.querySelector('.des h4')?.textContent.replace('$', '') || '0'),
        image: card.querySelector('img')?.src || ''
    };
}

function addToCart(product) {
    const cart = getCart();
    const item = cart.find(cartItem => cartItem.name === product.name && cartItem.image === product.image);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();
    showToast(`${product.name} added to your cart`);
}

function showToast(message) {
    let toast = document.getElementById('cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true"></i><span>${message}</span><a href="cart.html">View cart</a>`;
    toast.classList.add('visible');
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove('visible'), 3500);
}

function updateCartCount() {
    const count = getCart().reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('a[href="cart.html"]').forEach(link => {
        link.setAttribute('aria-label', `Shopping bag, ${count} item${count === 1 ? '' : 's'}`);
        const countBadge = link.querySelector('.cart-count');
        if (countBadge) countBadge.textContent = count;
    });
}

function renderCart() {
    const cartList = document.getElementById('cart-items');
    if (!cartList) return;

    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalElement = document.getElementById('cart-total');
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    cartList.innerHTML = cart.length ? cart.map((item, index) => `
        <article class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
                <span>${item.brand}</span>
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-control">
                <button type="button" data-action="decrease" data-index="${index}" aria-label="Remove one ${item.name}">-</button>
                <strong>${item.quantity}</strong>
                <button type="button" data-action="increase" data-index="${index}" aria-label="Add one ${item.name}">+</button>
            </div>
        </article>
    `).join('') : '<p class="empty-cart">Your cart is ready for its first mission.</p>';
}

function renderPayment() {
    const paymentTotal = document.getElementById('payment-total');
    if (!paymentTotal) return;

    const total = getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
    paymentTotal.textContent = `$${total.toFixed(2)}`;
}

if (bar) {
    bar.addEventListener('click', () => {
        navbar.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
}

const cartIcons = document.querySelectorAll('.cart');

cartIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(productFromCard(icon.closest('.pro')));
        icon.closest('.pro').classList.add('added');
        window.setTimeout(() => icon.closest('.pro').classList.remove('added'), 700);
    });
});

document.querySelectorAll('.pro').forEach(card => {
    card.addEventListener('click', (event) => {
        if (event.target.closest('.cart')) return;
        const product = productFromCard(card);
        const params = new URLSearchParams(product);
        window.location.href = `product.html?${params.toString()}`;
    });
});

const navbarLinks = document.querySelectorAll('#navbar a');

navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

document.addEventListener('click', (event) => {
    const button = event.target.closest('.quantity-control button');
    if (!button) return;

    const cart = getCart();
    const itemIndex = Number(button.dataset.index);
    const item = cart[itemIndex];
    if (!item) return;

    item.quantity += button.dataset.action === 'increase' ? 1 : -1;
    const updatedCart = item.quantity > 0 ? cart : cart.filter((_, index) => index !== itemIndex);
    saveCart(updatedCart);
    renderCart();
    updateCartCount();
});

const clearCart = document.getElementById('clear-cart');
if (clearCart) {
    clearCart.addEventListener('click', () => {
        saveCart([]);
        renderCart();
        updateCartCount();
    });
}

const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        showToast('Demo order received. No payment was charged.');
        paymentForm.reset();
    });
}

const detail = document.getElementById('product-detail');
if (detail) {
    const params = new URLSearchParams(window.location.search);
    const product = {
        name: params.get('name') || 'Orbital Explorer',
        brand: params.get('brand') || 'SpaceCon',
        price: Number.parseFloat(params.get('price') || '78'),
        image: params.get('image') || 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=85'
    };

    detail.querySelector('img').src = product.image;
    detail.querySelector('img').alt = product.name;
    detail.querySelector('[data-product-brand]').textContent = product.brand;
    detail.querySelector('[data-product-name]').textContent = product.name;
    detail.querySelector('[data-product-price]').textContent = `$${product.price.toFixed(2)}`;
    detail.querySelector('[data-product-add]').addEventListener('click', () => addToCart(product));
}

renderCart();
renderPayment();
updateCartCount();
