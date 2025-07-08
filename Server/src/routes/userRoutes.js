import express from 'express';
import { deleteAllUsers, deleteUser, getAllUsers, updateUser } from '../controllers/userControllers.js';
import { isUserLoggedIn, login, signUp, userPermission } from '../controllers/authControllers.js';

const router = express.Router();

router
    .route('/login')
    .post(login)

router
    .route('/signup')
    .post(signUp)

router
    .route('/all')
    .get(isUserLoggedIn,userPermission('admin'),getAllUsers)
    .delete(isUserLoggedIn,userPermission('admin'),deleteAllUsers);

router
    .route('/')
    .patch(isUserLoggedIn,updateUser)
    .delete(isUserLoggedIn,deleteUser);


export default router;
