import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
const router = Router();

router.post('/', userControllers.createUser);
router.get('/', auth("admin"), userControllers.getAllUsers);
router.get('/:id', userControllers.getSingleUser);
router.put('/:id', auth("admin", "customer"), userControllers.updateUser);
router.delete('/:id', userControllers.deleteUser)

export const userRoutes = router