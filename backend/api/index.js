require('dotenv').config();

const { admin, db } = require('../src/config/firebase');
const app = require('../src/app');

module.exports = async (req, res) => {
  try {
    return app(req, res);
  } catch (error) {
    console.error('API bootstrap error:', error);
    return res.status(500).json({ message: 'Server failed to start.' });
  }
};

