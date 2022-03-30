const request = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errData = await response.json();
      throw errData;
    }
  } catch (e) {
    console.log(e);
  }
};

const getProductData = async () => {
  try {
    const result = await request(`./api/productData.json`);
    return result;
  } catch (e) {
    return e;
  }
};

export default getProductData;
