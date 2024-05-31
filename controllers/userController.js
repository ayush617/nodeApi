const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = btoa(password)
    const user = await User.create({ username, password: hashedPassword });
    delete user.password;
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = (btoa(password) === user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
