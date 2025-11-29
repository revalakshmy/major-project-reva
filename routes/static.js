const express = require('express');
const router = express.Router();

// About page route (frontend-only, no backend logic touched)
router.get('/about', (req, res) => {
  res.render('about'); // will render views/about.ejs
});

module.exports = router;
