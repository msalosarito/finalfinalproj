const express = require('express');
const session = require('express-session');
const router = express.Router();
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();

/* GET manager dashboard. */
router.get('/manager', async (req, res, next) => {
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
