const express = require('express');

const router = express.Router();

const { User } = require('../../models/user');

router.get('/current', async (req, res, next) => {
  res.json({
    email: req.user.email,
  });
  next();
});

router.get('/logout', async (req, res, next) => {
  const { id } = req.user;
  await User.findByIdAndUpdate(id, { token: null });
  res.status(204).send();
});

module.exports = router;
