import express from 'express';
import { deleteAllUsers, deleteUser, getAllUsers, requestPasswordReset, resendOTP, resetPassword, updateUser, verifyOTP } from '../controllers/userControllers.js';
import { isUserLoggedIn, login, signUp, userPermission } from '../controllers/authControllers.js';

const router = express.Router();

router
    .route('/login')
    .post(login)

router
    .route('/signup')
    .post(signUp)

router
    .route('/verify-otp')
    .post(verifyOTP)

router
    .route('/request-password-reset')
    .post(requestPasswordReset);

router
    .route('/reset-password')
    .post(resetPassword);

router
    .route('/resend-otp')
    .post(resendOTP);

router
    .route('/all')
    .get(isUserLoggedIn,userPermission('admin'),getAllUsers)
    .delete(isUserLoggedIn,userPermission('admin'),deleteAllUsers);

router
    .route('/')
    .patch(isUserLoggedIn,updateUser)
    .delete(isUserLoggedIn,deleteUser);


export default router;
