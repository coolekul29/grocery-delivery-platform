class OrderSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(order) {
    this.observers.forEach((observer) => observer.update(order));
  }
}

class AdminObserver {
  update(order) {
    console.log(
      `[ADMIN] New order received. Order ID: ${order._id}`
    );
  }
}

class ProcessingObserver {
  update(order) {
    console.log(
      `[PROCESSING] Prepare order ${order._id} for packing.`
    );
  }
}

module.exports = {
  OrderSubject,
  AdminObserver,
  ProcessingObserver,
};