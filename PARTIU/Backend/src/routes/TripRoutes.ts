import { Router } from "express";
import { TripController } from "../controllers/TripController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();
const tripController = new TripController();
const auth = new AuthMiddleware();

router.get("/trip", auth.authenticateToken, (req, res) => tripController.list(req, res)); 'S'

router.get("/trip/:id", auth.authenticateToken, (req, res) => tripController.show(req, res)); 'S'

router.post("/trip", auth.authenticateToken, (req, res) => tripController.create(req, res)); 'S'

router.put("/trip/:id", auth.authenticateToken, (req, res) => tripController.update(req, res)); 'S'

router.delete("/trip/:id", auth.authenticateToken, (req, res) => tripController.delete(req, res)); 'S'

router.get("/trip/user/:userId", auth.authenticateToken, (req, res) => tripController.getByUser(req, res)); 'S'

export default router;