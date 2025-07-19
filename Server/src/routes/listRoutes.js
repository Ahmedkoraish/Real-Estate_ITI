import express from 'express'
import { isUserLoggedIn,userPermission } from '../controllers/authControllers.js';
import { createList, deleteList, readLists, searchLists, updateList } from '../controllers/listControllers.js';

const router = express.Router();

router
    .use(isUserLoggedIn)

router
    .route('/')
    .post(userPermission('host'),createList)
    .get(userPermission('admin','host','guset'),readLists)


router
    .route('/:id')
    .patch(userPermission('admin','host'),updateList)
    .delete(userPermission('admin','host'),deleteList)

router
    .route('/search')
    .get(searchLists)

export default router;

