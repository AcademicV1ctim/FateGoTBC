const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../models/Users.model.js');

router.get('/getUsers', async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error); 
  }
});

module.exports = router;
