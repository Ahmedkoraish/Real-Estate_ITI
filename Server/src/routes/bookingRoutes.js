import express from 'express'
import { isUserLoggedIn, userPermission } from '../controllers/authControllers.js';
import { 
    createBooking,
    deleteBooking,
    getAllGuestBooking,
    getAllHostListingBooked,
    getBookingById,
    updateBooking
        } from '../controllers/bookingControllers.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Manage room/house bookings
 */

/**
 * @swagger
 * /bookings/guest:
 *   get:
 *     summary: Get all bookings made by guests (admin/guest only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of guest bookings
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /bookings/host:
 *   get:
 *     summary: Get all bookings for listings owned by host (admin/host only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of host bookings
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /bookings/{id}:
 *   post:
 *     summary: Create a new booking (admin/guest only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Listing ID to book
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Booking created
 *       403:
 *         description: Access denied
 *
 *   get:
 *     summary: Get a booking by ID (admin/guest only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 *
 *   patch:
 *     summary: Update a booking (admin/guest only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Booking updated
 *       404:
 *         description: Booking not found
 *
 *   delete:
 *     summary: Delete a booking (admin/guest only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted
 *       404:
 *         description: Booking not found
 */

router
    .use(isUserLoggedIn)

router
    .route('/guest')
    .get(userPermission("admin","guest"),getAllGuestBooking)

router
    .route('/host')
    .get(userPermission("admin","host"),getAllHostListingBooked)

router 
    .route('/:id')
    .post(userPermission("admin","guest"),createBooking)
    .get(userPermission("admin","guest"),getBookingById)
    .patch(userPermission("admin","guest"),updateBooking)
    .delete(userPermission("admin","guest"),deleteBooking)



export default router;