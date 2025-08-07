const mongoose = require('mongoose')
const { Schema } = mongoose;

const loginSchema = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    approved: { type: Boolean, default: false}
}, {
    timestamps: true
})

const productSchema = new Schema({
    name: { type: String, required: true},
    price: { type: Number, required: true},
    maxOrders: {type: Number, required: true}
}, {
    timestamps: true
})

const ordersSchema = new Schema({
    prodId: {type: String, required: true},
    prodName: { type: String},
    prodPrice: { type: Number}
}, {
    timestamps: true
})

const login = mongoose.model('login', loginSchema)
const products = mongoose.model('products', productSchema)
const orders = mongoose.model('orders', ordersSchema)

module.exports = {
    login: login, 
    products: products,
    orders: orders
}