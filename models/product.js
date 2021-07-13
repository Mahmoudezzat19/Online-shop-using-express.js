const Cart = require('./cart');
const db = require('../util/database');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute('INSERT INTO product (title, price, description, imageUrl) VALUES (?,?,?,?)' ,
      [this.title, this.price, this.description, this.imageUrl]
    );
  }

  update() {
    return db.execute('UPDATE product SET title = ? ,price = ? ,description = ? ,imageUrl = ? WHERE id = ?',
    [this.title, this.price, this.description, this.imageUrl, this.id]
    );
  }

  static deleteById(id) {
    return db.execute(`DELETE FROM product WHERE id = ${id}`);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM product');
  }

  static findById(id) {
    return db.execute(`SELECT * FROM product WHERE id = ${id}`);
  }
};
