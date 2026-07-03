test("sorts products by lowest price", () => {

  const products = [
    { price: 10 },
    { price: 3 },
    { price: 6 },
  ];

  products.sort((a, b) => a.price - b.price);

  expect(products[0].price).toBe(3);

});