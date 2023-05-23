const express = require('express');
const session = require('express-session');
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware function to check if the user is an admin
const isUser = (req, res, next) => {
  const user = req.session.user; // Assuming you have the user information stored in the session
  if (user && user.usertype === 'User') {
    next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    res.status(403).send('Forbidden'); // User is not an admin, send a forbidden error
  }
};

/* GET profile page. */
router.get('/user', async function(req, res, next) {
  // Retrieve the logged-in user ID from the session or any other storage
  const userId = req.session.userId;

  try {
    // Fetch the user information based on the logged-in user ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { user_name: true, contact_number: true, email: true }
    });

    res.render('user', { user });
  } catch (error) {
    console.error('Error fetching user from Prisma:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/user', async function(req, res, next) {
  console.log('Received form data:', req.body);
  // Retrieve the logged-in user ID from the session or any other storage
  const userId = req.session.userId;
  
  try {
    // Update the user information in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        user_name: req.body.user_name,
        contact_number: req.body.contact_number,
        email: req.body.email
      }
    });

    res.redirect('/user');
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
