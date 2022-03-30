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

const productList = new ProductList($productList, productData);
const cartList = new CartList($cartList, cartState);

const setCartState = (newState) => {
  cartState = newState;
  cartList.setState(cartState);
};

const getInitialProductData = async () => {
  productData = await getProductData();
  productList.setState(productData);
};

const getInitialCartData = () => {
  const savedCartData = localStorage.getItem('cartState');
  if (savedCartData) {
    setCartState(JSON.parse(savedCartData));
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

const addCartItem = (id) => {
  const clickedProduct = filterClickedProduct(id);
  const checkedIdx = cartState.findIndex((d) => d.id === id);
  if (checkedIdx === -1) {
    clickedProduct.count = 1;
    setCartState([...cartState, clickedProduct]);
  } else {
    const newCartState = [...cartState];
    newCartState[checkedIdx].count += 1;
    setCartState(newCartState);
  }
};

const handleAddProduct = (e) => {
  const clickedProductId = parseInt(e.target.dataset.productid);
  // event delegation
  if (!clickedProductId) return;
  addCartItem(clickedProductId);
  openCart();
};

$productList.addEventListener('click', handleAddProduct);

const increaseCartItem = (id) => {
  const newCartState = [...cartState];
  const checkedIdx = cartState.findIndex((d) => d.id === id);
  if (newCartState[checkedIdx].count < 10) {
    newCartState[checkedIdx].count += 1;
  } else {
    alert('장바구니에 담을 수 있는 최대 수량은 10개입니다.');
  }

  setCartState(newCartState);
};

const decreaseCartItem = (id) => {
  const newCartState = [...cartState];
  const checkedIdx = cartState.findIndex((d) => d.id === id);
  if (newCartState[checkedIdx].count > 1) {
    newCartState[checkedIdx].count -= 1;
  } else {
    alert('장바구니에 담기 위한 최소 수량은 1개입니다.');
  }
  setCartState(newCartState);
};

const removeCartItem = (id) => {
  const checkedIdx = cartState.findIndex((d) => d.id === id);
  const newCartState = [...cartState];
  newCartState.splice(checkedIdx, 1);
  setCartState(newCartState);
};

const modifyCartList = (e) => {
  const currentProductId = parseInt(e.target.closest('li').id);
  switch (e.target.className) {
    case 'increase-btn':
      increaseCartItem(currentProductId);
      break;
    case 'decrease-btn':
      decreaseCartItem(currentProductId);
      break;
    case 'remove-btn':
      removeCartItem(currentProductId);
      break;
    default:
      return;
  }
};

$cartList.addEventListener('click', modifyCartList);

const saveToLocalStorage = () => {
  localStorage.setItem('cartState', JSON.stringify(cartState));
};

$paymentBtn.addEventListener('click', saveToLocalStorage);
getInitialProductData();
getInitialCartData();
