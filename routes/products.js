const express = require('express');
const app = express();
const router = express.Router();

const products = [
  { name: "product1" },
  { name: "product2" },
  { name: "product3" }
];

router.get('/', (req, res) => {
  res.send(products);
});

module.exports = router;