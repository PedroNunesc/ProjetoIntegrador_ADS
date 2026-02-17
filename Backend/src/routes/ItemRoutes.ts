import { Router } from "express";
import { ItemController } from "../controllers/ItemController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();
const itemController = new ItemController();
const auth = new AuthMiddleware();

router.get("/item", auth.authenticateToken, (req, res) => itemController.list(req, res)); 'S'

router.get("/item/:id", auth.authenticateToken, (req, res) => itemController.show(req, res)); 'S'

router.post("/item", auth.authenticateToken, (req, res) => itemController.create(req, res)); 'S'

router.put("/item/:id", auth.authenticateToken, (req, res) => itemController.update(req, res)); 'S'

router.delete("/item/:id", auth.authenticateToken, (req, res) => itemController.delete(req, res)); 'S'

router.get("/item/trip/:tripId", auth.authenticateToken, (req, res) => itemController.getByTrip(req, res)); 'S'

export default router;