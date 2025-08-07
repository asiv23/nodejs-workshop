var express = require('express');
var router = express.Router();
var UserSchema = require('../models/users.model')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {

    let users = await UserSchema.find({})

    res.send(users)
  } catch (error) {
    res.send(error)
  }
});

router.post('/', async function(req, res, next) {
  try {
    
    let { name, age, email, phone} = req.body

    let user = new UserSchema({
      name: name,
      age: age,
      email: email,
      phone: phone
    })

    await user.save()

    res.send(user)
  } catch (error) {
    res.send(error)
  }
});

router.put('/:id', async function(req, res, next) {
  try {

    let { id } = req.params
    let { name, age, email, phone} = req.body

    let user = await UserSchema.findByIdAndUpdate(id, {
      name: name,
      age: age,
      email: email,
      phone: phone
    }, { new: true})

    res.send(user)
  } catch (error) {
    res.send(error)
  }
});

router.delete('/:id', async function(req, res, next) {
  try {

    let { id } = req.params
    
    let user = await UserSchema.findByIdAndDelete(id)

    res.send(user)
  } catch (error) {
    res.send(error)
  }
});

module.exports = router;
