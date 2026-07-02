class BaseUser {
  constructor({ name, email, phone, address, password }) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.password = password;
  }
}

class CustomerUser extends BaseUser {
  constructor(userData) {
    super(userData);
    this.role = "customer";
    this.membershipType = "standard";
  }
}

class PremiumUser extends BaseUser {
  constructor(userData) {
    super(userData);
    this.role = "customer";
    this.membershipType = "premium";
  }
}

class AdminUser extends BaseUser {
  constructor(userData) {
    super(userData);
    this.role = "admin";
    this.membershipType = "admin";
  }
}

class UserFactory {
  static createUser(type, userData) {
    switch (type) {
      case "premium":
        return new PremiumUser(userData);

      case "admin":
        return new AdminUser(userData);

      case "customer":
      default:
        return new CustomerUser(userData);
    }
  }
}

module.exports = UserFactory;