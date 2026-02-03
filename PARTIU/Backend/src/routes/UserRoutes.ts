import { Router } from "express";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { UserController } from "../controllers/UserController";

const router = Router();
const auth = new AuthMiddleware();
const controller = new UserController();

router.put('/users/:id', auth.authenticateToken, controller.update); 'S'

router.delete('/users/:id', auth.authenticateToken, controller.delete); 'S'

router.post('/users', controller.create); 'S'

router.get('/users', controller.listAll); 'S'

export default router;