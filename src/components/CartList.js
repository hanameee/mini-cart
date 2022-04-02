const $totalCount = document.getElementById('total-count');

class CartList {
  constructor($target, state) {
    this.state = state;
    this.$section = document.createElement('ul');
    this.$section.className = '-my-6 divide-y divide-gray-200';
    $target.appendChild(this.$section);
    this.render();
  }

  setState(newState) {
    this.state = newState;
    this.render();
  }

  addCartItem(clickedProduct) {
    let newState;
    const clickedProductId = clickedProduct.id;
    const checkedIdx = this.state.findIndex((d) => d.id === clickedProductId);
    if (checkedIdx === -1) {
      const newItem = { ...clickedProduct, count: 1 };
      newState = [...this.state, newItem];
    } else {
      newState = [...this.state];
      newState[checkedIdx].count += 1;
    }
    this.setState(newState);
  }

  increaseCartItem(id) {
    const newState = [...this.state];
    const checkedIdx = this.state.findIndex((d) => d.id === id);
    if (newState[checkedIdx].count < 10) {
      newState[checkedIdx].count += 1;
    } else {
      alert('장바구니에 담을 수 있는 최대 수량은 10개입니다.');
    }
    this.setState(newState);
  }

  decreaseCartItem(id) {
    const newState = [...this.state];
    const checkedIdx = this.state.findIndex((d) => d.id === id);
    if (newState[checkedIdx].count > 1) {
      newState[checkedIdx].count -= 1;
    } else {
      alert('장바구니에 담기 위한 최소 수량은 1개입니다.');
    }
    this.setState(newState);
  }

  removeCartItem(id) {
    const newState = [...this.state];
    const checkedIdx = this.state.findIndex((d) => d.id === id);
    newState.splice(checkedIdx, 1);
    this.setState(newState);
  }

  saveToLocalStorage() {
    localStorage.setItem('cartState', JSON.stringify(this.state));
  }

  render() {
    this.$section.innerHTML = this.state
      .map(
        ({ id, imgSrc, name, price, count }) =>
          `
      <li class="flex py-6" id=${id}>
        <div class="h-24 w-24 overflow-hidden rounded-md border border-gray-200">
          <img
            src="${imgSrc}"
            class="h-full w-full object-cover object-center"
          />
        </div>
        <div class="ml-4 flex flex-1 flex-col">
          <div>
            <div class="flex justify-between text-base font-medium text-gray-900">
              <h3>${name}</h3>
              <p class="ml-4">${(price * count).toLocaleString()}원</p>
            </div>
          </div>
          <div class="flex flex-1 items-end justify-between">
            <div class="flex text-gray-500">
              <button class="decrease-btn">-</button>
              <div class="mx-2 font-bold">${count}개</div>
              <button class="increase-btn">+</button>
            </div>
            <button type="button" class="font-medium text-sky-400 hover:text-sky-500">
              <p class="remove-btn">삭제하기</p>
            </button>
          </div>
        </div>
      </li>
  `
      )
      .join('');
    $totalCount.innerHTML =
      this.state
        .reduce((acc, cur) => acc + cur.price * cur.count, 0)
        .toLocaleString() + '원';
  }
}

export default CartList;
