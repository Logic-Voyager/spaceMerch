// Mobile Menu Toggle
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const navbar = document.getElementById('navbar');

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

// Cart functionality (basic)
const cartIcons = document.querySelectorAll('.cart');

cartIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Added to cart!');
    });
});

// Remove active class from navbar links when clicked
const navbarLinks = document.querySelectorAll('#navbar a');

navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});
