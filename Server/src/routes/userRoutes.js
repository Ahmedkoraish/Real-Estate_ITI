import express from 'express';
import { deleteAllUsers, deleteUser, getAllUsers, updateUser } from '../controllers/userControllers.js';
import { isUserLoggedIn, login, signUp, userPermission } from '../controllers/authControllers.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Admin access only
 *   delete:
 *     summary: Delete all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: All users deleted
 *       403:
 *         description: Admin access only
 */

/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Update logged-in user
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete logged-in user
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User deleted
 */

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
