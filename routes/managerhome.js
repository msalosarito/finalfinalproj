const express = require('express');
const session = require('express-session');
const router = express.Router();
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

// Middleware function to check if the user is an admin
const isManager = (req, res, next) => {
  const user = req.session.user; // Assuming you have the user information stored in the session
  if (user && user.usertype === 'Manager') {
    next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    res.status(403).send('Forbidden'); // User is not an admin, send a forbidden error
  }
};
/* GET manager dashboard. */
router.get('/manager',isManager, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();

    res.render('manager', { title: 'Express', users });
  } catch (error) {
    console.error('Error fetching user records:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/manager-edit', async function(req,res,next){
  const {userID} = req.query;
  
  try{
    const user = await prisma.user.findUnique({
      where: {id: userID},
    });

    if(!user){
      return res.status(404).send('User not found');
    }

    res.render('manager-edit',{user});
  } catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/manager-edit',  async function(req,res,next){
  const {userID, user_name, contact_number, email, usertype} = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {id : userID},
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const updateUser = await prisma.user.update({
      where: {id: userID},
      data: {
        user_name,
        contact_number,
        email,
        usertype,
      },
    });

    res.redirect('/manager');
  } catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
