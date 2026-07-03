test("search finds matching product", () => {
  const products = [
    { name: "Apple" },
    { name: "Milk" },
  ];

  const results = products.filter(product =>
    product.name.toLowerCase().includes("apple")
  );

  expect(results).toHaveLength(1);
  expect(results[0].name).toBe("Apple");
});