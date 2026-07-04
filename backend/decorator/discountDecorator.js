class OrderCost {
  constructor(subtotal) {
    this.subtotal = subtotal;
  }

  calculate() {
    return {
      subtotal: this.subtotal,
      discount: 0,
      deliveryFee: 5,
      total: this.subtotal + 5,
      appliedDiscounts: [],
    };
  }
}

class DiscountDecorator {
  constructor(orderCost) {
    this.orderCost = orderCost;
  }

  calculate() {
    return this.orderCost.calculate();
  }
}

class PromoDiscountDecorator extends DiscountDecorator {
  calculate() {
    const result = super.calculate();
    const promoDiscount = result.subtotal * 0.1;

    return {
      ...result,
      discount: result.discount + promoDiscount,
      total: result.total - promoDiscount,
      appliedDiscounts: [...result.appliedDiscounts, "Promo discount 10%"],
    };
  }
}

class StudentDiscountDecorator extends DiscountDecorator {
  calculate() {
    const result = super.calculate();
    const studentDiscount = result.subtotal * 0.05;

    return {
      ...result,
      discount: result.discount + studentDiscount,
      total: result.total - studentDiscount,
      appliedDiscounts: [...result.appliedDiscounts, "Student discount 5%"],
    };
  }
}

class FreeDeliveryDecorator extends DiscountDecorator {
  calculate() {
    const result = super.calculate();

    return {
      ...result,
      deliveryFee: 0,
      total: result.total - result.deliveryFee,
      appliedDiscounts: [...result.appliedDiscounts, "Free delivery"],
    };
  }
}

module.exports = {
  OrderCost,
  PromoDiscountDecorator,
  StudentDiscountDecorator,
  FreeDeliveryDecorator,
};