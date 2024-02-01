import express from "express";
import userController from "../controller/user-controller.js";
import pasienController from "../controller/pasien-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

// pasien API
userRouter.post('/api/pasiens', pasienController.create);
userRouter.get('/api/pasiens/:pasienId', pasienController.get);
userRouter.put('/api/pasiens/:pasienId', pasienController.update);
userRouter.delete('/api/pasiens/:pasienId', pasienController.remove);

export {
    userRouter
}
