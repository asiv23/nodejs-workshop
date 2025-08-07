var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var { login } = require('../models/api.models')
var { products } = require('../models/api.models')
var { orders } = require('../models/api.models')

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/* LOGIN PROCESS */
//[POST] /api/v1/login
router.post('/v1/login', async function(req, res, next) {
  try {
    
    let { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'both username and password are required' })
    }

    let newlogin = new login({
      username: username,
      password: password
    })
    
    let user = await login.findOne({ username: username })
    let compare_hash = await bcrypt.compare(password, user.password)

    if (!compare_hash) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, PRIVATE_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
    // res.send(newlogin)
  } catch (error) {
    res.send(error)
  }
});

/* REGISTRATION PROCESS */
//[POST] /api/v1/register
router.post('/v1/register', async function(req, res, next) {
  try {
    
    let { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'both username and password are required' })
    }

    let hash = await bcrypt.hash(password, 10)
    let user = await login.findOne({ username: username })
    if (user)
        return res.status(400).json({ message: 'username already taken' });

    let newlogin = new login({
      username: username,
      password: hash,
      approved: false
    })

    await newlogin.save()

    res.send(newlogin)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
});

//[PUT] /api/v1/users/:id/approve
router.put('/v1/users/:id/approve', async function(req, res, next) {
  try {

    let { id } = req.params

    let newlogin = await login.findByIdAndUpdate(id, {
      approved: true
    }, { new: true})

    res.send(newlogin)
  } catch (error) {
    res.send(error)
  }
});

/* PRODUCTS */
// [GET] /api/v1/products
router.get('/v1/products', async function(req, res, next) {
  try {

    let newproducts = await products.find({});

    res.send(newproducts)
  } catch (error) {
    res.send(error)
  }
});

// [GET] /api/v1/products/:id
router.get('/v1/products/:id', async function(req, res, next) {
  try {

    let { id } = req.params
    let newproducts = await products.findById(id)

    res.send(newproducts)
  } catch (error) {
    res.send(error)
  }
});

// [POST] /api/v1/products
router.post('/v1/products', async function(req, res, next) {
  try {
    
    let { name, price, maxOrders } = req.body
    if (!name || !price || !maxOrders) {
      return res.status(400).json({ message: 'please enter all fields' })
    }

    let newproducts = new products({
      name: name,
      price: price,
      maxOrders: maxOrders
    })

    await newproducts.save()

    res.send(newproducts)
  } catch (error) {
    res.send(error)
  }
});

// [PUT] /api/v1/products/:id
router.put('/v1/products/:id', async function(req, res, next) {
  try {
    
    let { id } = req.params
    let { name, price, maxOrders } = req.body

    let newproducts = await products.findByIdAndUpdate(id, {
        name: name,
        price: price,
        maxOrders: maxOrders
    }, { new: true})

    res.send(newproducts)
  } catch (error) {
    res.send(error)
  }
});

// [DELETE] /api/v1/products/:id
router.delete('/v1/products/:id', async function(req, res, next) {
  try {

    let { id } = req.params
    
    let newproducts = await products.findByIdAndDelete(id)

    res.send(newproducts)
  } catch (error) {
    res.send(error)
  }
});

/* PRODUCT ORDERS */
// [GET] /api/v1/products/:id/orders
router.get('/v1/products/:id/orders', async function(req, res, next) {
  try {

    let prodId = req.params.id
    
    let newOrder = await orders.find({ prodId: prodId })

    res.send(newOrder)
  } catch (error) {
    res.send(error)
  }
});

// [POST] /api/v1/products/:id/orders
router.post('/v1/products/:id/orders', async function(req, res, next) {
  try {
    
    let prodId = req.params.id
    let newproducts = await products.findById(prodId)
    let orderCount = await orders.countDocuments({ prodId: prodId })

    if (orderCount >= newproducts.maxOrders) {
      return res.status(400).json({ message: 'maxed orders reached' });
    }

    let newOrder = new orders({
        prodId: prodId,
        prodName: newproducts.name,
        prodPrice: newproducts.price
    })
        
    await newOrder.save()

    res.send(newOrder)
  } catch (error) {
    res.send(error)
  }
});

/* ORDERS */
// [GET] /api/v1/orders
router.get('/v1/orders', async function(req, res, next) {
  try {

    let newOrder = await orders.find({})

    res.send(newOrder)
  } catch (error) {
    res.send(error)
  }
});

module.exports = router;
