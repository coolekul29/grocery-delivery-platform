class ProductPrototype {
  constructor(product) {
    this.product = product;
  }

  clone(changes = {}) {
    return {
      name: changes.name || `${this.product.name} Copy`,
      description: changes.description || this.product.description,
      price: changes.price || this.product.price,
      category: changes.category || this.product.category,
      stock: changes.stock || this.product.stock,
      image: changes.image || this.product.image,
    };
  }
}

module.exports = ProductPrototype;