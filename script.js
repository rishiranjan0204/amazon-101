const products = [
  {
    id: 1,
    name: 'Samsung Galaxy S23',
    badge: 'Best Seller',
    price: 64999,
    rating: 4.6,
    description: 'Smartphone with 50MP camera, 8GB RAM and 256GB storage.',
    image: 'https://picsum.photos/seed/samsung/800/450'
  },
  {
    id: 2,
    name: 'Amazon Echo Dot',
    badge: 'Prime',
    price: 4499,
    rating: 4.4,
    description: 'Smart speaker with Alexa to play music and control devices.',
    image: 'https://picsum.photos/seed/echodot/800/450'
  },
  {
    id: 3,
    name: 'boAt Airdopes 141',
    badge: 'New',
    price: 1499,
    rating: 4.2,
    description: 'Wireless earbuds with immersive sound and long battery life.',
    image: 'https://picsum.photos/seed/airdopes/800/450'
  },
  {
    id: 4,
    name: 'Apple MacBook Air',
    badge: 'Premium',
    price: 114999,
    rating: 4.7,
    description: 'Lightweight laptop with M1 chip and Retina display.',
    image: 'https://picsum.photos/seed/macbook/800/450'
  },
  {
    id: 5,
    name: 'Sony Bravia 43" 4K TV',
    price: 44990,
    rating: 4.5,
    description: 'Smart LED TV with HDR and voice control.',
    image: 'https://picsum.photos/seed/tv/800/450'
  },
  {
    id: 6,
    name: 'Philips Air Fryer',
    price: 9999,
    rating: 4.3,
    description: 'Healthier cooking with rapid air technology.',
    image: 'https://picsum.photos/seed/airfryer/800/450'
  },
  {
    id: 7,
    name: 'Nike Running Shoes',
    price: 3399,
    rating: 4.4,
    description: 'Lightweight sports shoes for daily jogging and training.',
    image: 'https://picsum.photos/seed/nike/800/450'
  },
  {
    id: 8,
    name: 'Noise ColorFit Smartwatch',
    price: 2499,
    rating: 4.1,
    description: 'Fitness watch with heart rate monitor and sleep tracking.',
    image: 'https://picsum.photos/seed/smartwatch/800/450'
  }
];

const cart = new Map();
const productsGrid = document.getElementById('productsGrid');
const cartButton = document.getElementById('cartButton');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartOverlay = document.getElementById('cartOverlay');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const cartSummary = document.getElementById('cartSummary');

function formatPrice(value) {
  return `₹${value.toLocaleString('en-IN')}`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderProducts(items) {
  productsGrid.innerHTML = '';
  items.forEach(product => {
    const name = escapeHtml(product.name);
    const description = escapeHtml(product.description);

    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/800x450?text=Image+not+available'">
      <div class="product-info">
        ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ''}
        <h3>${name}</h3>
        <div class="product-rating"><span>★</span>${product.rating} • Prime</div>
        <p>${description}</p>
        <div class="product-subtext">Free Delivery on orders over ₹499</div>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-button" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

function updateCart() {
  const items = Array.from(cart.values());
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);
  cartSummary.textContent = count === 0 ? 'Items in your cart' : `${count} item${count > 1 ? 's' : ''} in cart`;
  renderCartItems(items);
}

function renderCartItems(items) {
  cartItems.innerHTML = '';
  if (items.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty. Add something great!</p>';
    return;
  }

  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span>${item.quantity} × ${formatPrice(item.price)}</span>
      </div>
      <div>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
        <button data-id="${item.id}">Remove</button>
      </div>
    `;
    cartItems.appendChild(row);
  });
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;

  if (cart.has(productId)) {
    const entry = cart.get(productId);
    entry.quantity += 1;
  } else {
    cart.set(productId, { ...product, quantity: 1 });
  }
  updateCart();
}

function removeFromCart(productId) {
  if (!cart.has(productId)) return;
  cart.delete(productId);
  updateCart();
}

function toggleCart(open) {
  cartPanel.classList.toggle('open', open);
  cartOverlay.classList.toggle('active', open);
}

productsGrid.addEventListener('click', event => {
  const button = event.target.closest('.add-button');
  if (!button) return;
  const id = Number(button.dataset.id);
  addToCart(id);
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  const id = Number(button.dataset.id);
  removeFromCart(id);
});

cartButton.addEventListener('click', () => toggleCart(true));
closeCart.addEventListener('click', () => toggleCart(false));
cartOverlay.addEventListener('click', () => toggleCart(false));
checkoutButton.addEventListener('click', () => {
  if (cart.size === 0) {
    alert('Your cart is empty. Add items before proceeding.');
    return;
  }
  alert('Order placed successfully! Thank you for shopping on Amazon.in');
  cart.clear();
  updateCart();
  toggleCart(false);
});

searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm));
  renderProducts(searchTerm ? filtered : products);
});

searchInput.addEventListener('keyup', event => {
  if (event.key === 'Enter') searchButton.click();
});

renderProducts(products);
updateCart();
