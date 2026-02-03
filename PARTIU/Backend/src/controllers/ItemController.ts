import { Request, Response } from "express";
import { ItemRepository } from "../repositories/ItemRepository";
import { UserRepository } from "../repositories/UserRepository";
import { TripRepository } from "../repositories/TripRepository";

const itemRepository = new ItemRepository();
const userRepository = new UserRepository();
const tripRepository = new TripRepository();

export class ItemController {

  async list(req: Request, res: Response) {
    try {
      const items = await itemRepository.findAllWithUser();
      return res.json(items);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor interno" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const item = await itemRepository.findByIdWithUser(Number(id));
      if (!item) {
        return res.status(404).json({ message: "Item não encontrado" });
      }

      return res.json(item);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor interno" });
    }
  }

  async getByTrip(req: Request, res: Response) {
    try {
      const { tripId } = req.params;
      const items = await itemRepository.findByTripId(Number(tripId));
      return res.json(items);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, category, tripId } = req.body;
      const userId = req.user.id;

      if (!name || !category || !tripId) {
        return res.status(400).json({
          message: "Name, category and tripId are required",
        });
      }

      const user = await userRepository.findById(Number(userId));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const trip = await tripRepository.findById(Number(tripId));
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const item = await itemRepository.createAndSave({
        name,
        category,
        user,
        trip,
      });

      return res.status(201).json(item);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { name, category, tripId, isPacked } = req.body;

      const item = await itemRepository.findByIdWithUser(Number(id));
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      if (req.user.role !== "admin" && item.user?.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (name) item.name = name;
      if (category) item.category = category;
      if (typeof isPacked === "boolean") item.isPacked = isPacked;

      if (tripId) {
        const trip = await tripRepository.findById(Number(tripId));
        if (!trip) {
          return res.status(404).json({ message: "Trip not found" });
        }
        item.trip = trip;
      }

      const updatedItem = await itemRepository.save(item);
      return res.json(updatedItem);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const item = await itemRepository.findByIdWithUser(Number(id));
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      if (req.user.role !== "admin" && item.user?.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await itemRepository.removeItem(item);
      return res.status(204).send();

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}