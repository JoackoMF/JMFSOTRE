// Datos de los productos
const products = [
    {
        id: 1,
        name: "Funda Goku",
        price: 10000,
        image: "images/goku.png"
    },
    {
        id: 2,
        name: "Funda Gojo",
        price: 10000,
        image: "images/gojo.png"
    },
    {
        id: 3,
        name: "Funda Meliodas",
        price: 10000,
        image: "images/meliodas.png"
    },
    {
        id: 4,
        name: "Funda Escanor",
        price: 10000,
        image: "images/escanor.png"
    },
    {
        id: 5,
        name: "Funda Ippo",
        price: 10000,
        image: "images/ippo.png"
    },
    {
        id: 6,
        name: "Funda Kaneki",
        price: 10000,
        image: "images/kaneki.png"
    },
    {
        id: 7,
        name: "Funda Naruto",
        price: 10000,
        image: "images/naruto.png"
    }
];


// Variables para el carrusel
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
// Variables para el carrito
let cartItems = [];
const cartAmount = document.getElementById('cart-amount');
const cartButton = document.querySelector('.cart-button');
const cartDropdown = document.getElementById('cart-dropdown');
const checkoutButton = document.getElementById('checkout-button');

// Obtener colores de las variables CSS
const getColorVariable = (varName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
};

// Colores desde CSS variables
const primaryColor = getColorVariable('--primary');
const primaryDarkColor = getColorVariable('--primary-dark');
const accentColor = getColorVariable('--accent');
const errorColor = getColorVariable('--error');

// Función para mostrar slide actual
function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

// Función para ir al siguiente slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

// Función para ir al slide anterior
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Eventos para los botones del carrusel
nextButton.addEventListener('click', nextSlide);
prevButton.addEventListener('click', prevSlide);

// Carrusel automático
setInterval(nextSlide, 5000);

// Inicializar el carrusel
showSlide(currentSlide);

// Función para cargar los productos dinámicamente
function loadProducts() {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}$</p>
            <button class="add-to-cart" data-id="${product.id}">Agregar al carrito</button>
        `;
        productContainer.appendChild(productCard);
    });

    addCartEvents();
}

// Función para actualizar el carrito
function updateCart() {
    let total = 0;
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
        total += item.price * item.quantity;
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <p>${item.name} x 
                <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="cart-quantity">
            </p>
            <p class="cart-item-price">${item.price * item.quantity}$</p>
            <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });

    cartAmount.textContent = total + '$';
    saveCart();
    addCartInteractionEvents();
}

function addCartInteractionEvents() {
    const removeButtons = document.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const idToRemove = parseInt(button.getAttribute('data-id'));
            cartItems = cartItems.filter(item => item.id !== idToRemove);
            updateCart();
        });
    });

    const quantityInputs = document.querySelectorAll('.cart-quantity');
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const idToUpdate = parseInt(input.getAttribute('data-id'));
            const newQuantity = parseInt(input.value);
            if (newQuantity > 0) {
                const itemToUpdate = cartItems.find(item => item.id === idToUpdate);
                if (itemToUpdate) {
                    itemToUpdate.quantity = newQuantity;
                    updateCart();
                }
            } else {
                input.value = 1;
            }
        });
    });
}

function addCartEvents() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            const product = products.find(item => item.id === productId);

            if (product) {
                const existingItem = cartItems.find(item => item.id === productId);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cartItems.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1
                    });
                }

                updateCart();

                button.textContent = '¡Añadido!';
                button.style.backgroundColor = accentColor;

                setTimeout(() => {
                    button.textContent = 'Agregar al carrito';
                    button.style.backgroundColor = primaryColor;
                }, 1000);
            }
        });
    });
}

// Función para validar el formulario de contacto
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    let isValid = true;

    const errorMessages = document.querySelectorAll('.form-error');
    errorMessages.forEach(error => error.remove());

    if (!name) {
        showError('name', 'El nombre es obligatorio.');
        isValid = false;
    }

    if (!email) {
        showError('email', 'El correo electrónico es obligatorio.');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'El correo electrónico no es válido.');
        isValid = false;
    }

    if (phone && !isValidPhone(phone)) {
        showError('phone', 'El teléfono no es válido.');
        isValid = false;
    }

    if (!message) {
        showError('message', 'El mensaje es obligatorio.');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    return phone.length >= 7;
}

function showError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = errorMessage;
    field.parentNode.appendChild(errorElement);
}

// Manejar el envío del formulario (si estamos en la página de contacto)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('Datos del formulario:', formData);

            const prevSuccess = contactForm.querySelector('.success-message');
            if (prevSuccess) prevSuccess.remove();

            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
            contactForm.appendChild(successMessage);

            setTimeout(() => {
                contactForm.reset();
                successMessage.remove();
            }, 3000);
        }
    });
}

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Función para cargar el carrito desde localStorage
function loadCart() {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
        cartItems = JSON.parse(storedCart);
        updateCart();
    }
}

// Inicializar el carrusel
showSlide(currentSlide);

// Cargar los productos y el carrito al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();  //  <---  ¡¡¡¡AÑADIDO ESTO!!!!
    loadCart();
});

// Evento para mostrar/ocultar el carrito
cartButton.addEventListener('click', (event) => {
    event.preventDefault();
    cartDropdown.classList.toggle('show-cart');
});

// Evento para el botón de "Comprar carrito"
checkoutButton.addEventListener('click', () => {
    if (cartItems.length > 0) {
        alert('¡Compra realizada! Total: ' + cartAmount.textContent);
        cartItems = [];
        updateCart();
    }
});