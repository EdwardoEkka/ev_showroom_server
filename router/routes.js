const express = require('express');
const controller = require('../controllers/controller');
const router=express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cors = require("cors");
router.use(cors());

router.post('/user-login',controller.addUser);
router.post('/manual-sign_up',controller.manualSignUp);
router.post('/manual-sign_in',controller.Manual_login);
router.get('/user-details', authMiddleware, controller.getUserDetails);
router.post('/contact-us',controller.contact_us);
router.post('/book-vehicle',controller.book_vehicle);
router.get('/get-bookings/:userId',controller.get_Bookings);
router.delete('/delete-booking/:bookId',controller.delete_Booking);
module.exports=router;