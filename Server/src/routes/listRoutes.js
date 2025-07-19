import express from 'express'
import { isUserLoggedIn,userPermission } from '../controllers/authControllers.js';
import { createList, deleteList, getListById, readLists, searchLists, updateList } from '../controllers/listControllers.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: Manage listings (houses/rooms)
 */

/**
 * @swagger
 * /lists:
 *   post:
 *     summary: Create a new listing (host only)
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Listing created successfully
 *       403:
 *         description: Only hosts can create listings
 *
 *   get:
 *     summary: Get all listings (admin, host, guest)
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all listings
 */

/**
 * @swagger
 * /lists/search:
 *   get:
 *     summary: Search listings
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *     responses:
 *       200:
 *         description: List of matched results
 */

/**
 * @swagger
 * /lists/{id}:
 *   get:
 *     summary: Get listing by ID
 *     tags: [Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing data
 *       404:
 *         description: Listing not found
 *
 *   patch:
 *     summary: Update a listing (admin or host only)
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Listing updated
 *       403:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete a listing (admin or host only)
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing deleted
 *       403:
 *         description: Unauthorized
 */

router
    .use(isUserLoggedIn)

router
    .route('/')
    .post(userPermission('host'),createList)
    .get(userPermission('admin','host','guset'),readLists)


router
    .route('/:id')
    .get(getListById)
    .patch(userPermission('admin','host'),updateList)
    .delete(userPermission('admin','host'),deleteList)

router
    .route('/search')
    .get(searchLists)

export default router;

