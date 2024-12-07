const API_URL = "https://fakestoreapi.com/products/1";
const productContainer = document.getElementById('product-container');
let deferredPrompt;

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registrado correctamente'))
        .catch(err => console.error('Error al registrar el Service Worker:', err));
}

// Función para cargar datos del producto
async function loadProduct() {
    try {
        const response = await fetch(API_URL);
        const product = await response.json();

        // Guardar datos en localStorage
        localStorage.setItem('product', JSON.stringify(product));

        displayProduct(product);
    } catch (error) {
        console.error('Error al cargar el producto:', error);

        // Cargar datos desde localStorage si no hay conexión
        const savedProduct = localStorage.getItem('product');
        if (savedProduct) {
            displayProduct(JSON.parse(savedProduct));
        } else {
            productContainer.innerHTML = `<p>Error: No se pudo cargar el producto y no hay datos guardados.</p>`;
        }
    }
}

// Función para mostrar los datos del producto
function displayProduct(product) {
    productContainer.innerHTML = `
        <img src="${product.image}" alt="${product.title}" style="max-width: 200px;">
        <h2>${product.title}</h2>
        <p><strong>Precio:</strong> $${product.price}</p>
        <p><strong>Categoría:</strong> ${product.category}</p>
        <p><strong>Descripción:</strong> ${product.description}</p>
        <p><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} opiniones)</p>
    `;
}

// Escuchar el evento `beforeinstallprompt`
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e; // Guardar el evento para usarlo más tarde
    const installButton = document.createElement('button');
    installButton.textContent = 'Instalar Aplicación';
    installButton.style = 'position: fixed; bottom: 20px; right: 20px;';
    document.body.appendChild(installButton);

    installButton.addEventListener('click', () => {
        deferredPrompt.prompt(); // Mostrar el prompt de instalación
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('El usuario aceptó la instalación');
            } else {
                console.log('El usuario rechazó la instalación');
            }
            deferredPrompt = null; // Limpiar la referencia
        });
    });
});

// Cargar producto al inicio
loadProduct();
