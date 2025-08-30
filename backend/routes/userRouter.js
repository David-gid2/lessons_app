import {Router} from 'express';
import {getUsers, 
    getUserById, 
    createUser, 
    deleteUser,
        } from '../controllers/userController.js';
import {checkAdminToken} from '../middleware/checkAdminToken.js';
const userRouter = Router();


userRouter.get('/', checkAdminToken, getUsers);
userRouter.get('/:id', checkAdminToken, getUserById);
userRouter.post('/', checkAdminToken, createUser);
userRouter.delete('/:id', checkAdminToken, deleteUser);

export default userRouter;