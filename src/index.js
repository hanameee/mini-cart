import getProductData from './api/getProductData.js';
import ProductList from './components/ProductList.js';
import CartList from './components/CartList.js';

const $productList = document.getElementById('product-list');
const $cartList = document.getElementById('cart-list');

const $openCartBtn = document.getElementById('open-cart-btn');
const $closeCartBtn = document.getElementById('close-cart-btn');
const $shoppingCart = document.getElementById('shopping-cart');
const $backdrop = document.getElementById('backdrop');

const $paymentBtn = document.getElementById('payment-btn');

let productData = null;
let cartState = [];

const cartList = new CartList($cartList, cartState);
const productList = new ProductList($productList, productData);

const getInitialProductData = async () => {
  productData = await getProductData();
  productList.setState(productData);
};

const getInitialCartState = () => {
  const savedCartState = localStorage.getItem('cartState');
  if (savedCartState) {
    cartList.setState(JSON.parse(savedCartState));
  }
};

const openCart = () => {
  $shoppingCart.classList.add('translate-x-0');
  $shoppingCart.classList.remove('translate-x-full');
  $backdrop.hidden = false;
};

const closeCart = () => {
  $shoppingCart.classList.remove('translate-x-0');
  $shoppingCart.classList.add('translate-x-full');
  $backdrop.hidden = true;
};

$openCartBtn.addEventListener('click', openCart);
$closeCartBtn.addEventListener('click', closeCart);
$backdrop.addEventListener('click', closeCart);

const filterClickedProduct = (id) => productData.find((data) => data.id == id);

const handleAddProduct = (e) => {
  const clickedProductId = parseInt(e.target.dataset.productid);
  // event delegation
  if (!clickedProductId) return;
  const clickedProduct = filterClickedProduct(clickedProductId);
  cartList.addCartItem(clickedProduct);
  openCart();
};

$productList.addEventListener('click', handleAddProduct);

const modifyCartList = (e) => {
  const currentProductId = parseInt(e.target.closest('li').id);
  switch (e.target.className) {
    case 'increase-btn':
      cartList.increaseCartItem(currentProductId);
      break;
    case 'decrease-btn':
      cartList.decreaseCartItem(currentProductId);
      break;
    case 'remove-btn':
      cartList.removeCartItem(currentProductId);
      break;
    default:
      return;
  }
};

$cartList.addEventListener('click', modifyCartList);

const saveToLocalStorage = () => {
  cartList.saveToLocalStorage();
};

$paymentBtn.addEventListener('click', saveToLocalStorage);
getInitialProductData();
getInitialCartState();
