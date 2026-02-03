import { Request, Response } from "express";
import { TripRepository } from "../repositories/TripRepository";
import { UserRepository } from "../repositories/UserRepository";
import { ChecklistService } from "../services/ChecklistService";
import { getHistoricalAverageForInterval } from "../services/HistoricalAverage";

const tripRepository = new TripRepository();
const userRepository = new UserRepository();

export class TripController {
  async list(req: Request, res: Response) {
    try {
      const trips = await tripRepository.findAllWithUser();
      return res.json(trips);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const trip = await tripRepository.findByIdWithUser(Number(id));

      if (!trip) return res.status(404).json({ message: "Trip not found" });

      return res.json(trip);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const trips = await tripRepository.findByUserId(Number(userId));

      return res.json(trips);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, city, country, startDate, endDate, automaticList, type } = req.body;
      const userId = req.user.id;

      if (!name || !city || !country || !startDate || !endDate) {
        return res.status(400).json({
          message: "Name, city, country, startDate and endDate are required",
        });
      }

      const user = await userRepository.findById(Number(userId));
      if (!user) return res.status(404).json({ message: "User not found" });

      const trip = await tripRepository.createAndSave({
        name,
        city,
        country,
        startDate,
        endDate,
        user,
        automaticList: !!automaticList,
        type: type || "outro",
      });

      let temperature = 20; 
      if (automaticList) {
        const avg = await getHistoricalAverageForInterval(city, country, startDate, endDate);
        temperature = avg?.temp_avg ?? 20;
      }

      await ChecklistService.generateChecklist(
        temperature,
        !!automaticList,
        trip,
        user
      );

      return res.status(201).json({
        message: "Trip created successfully",
        trip,
      });

    } catch (error) {
      console.error("Erro interno:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { name, city, country, startDate, endDate, type } = req.body;

    const trip = await tripRepository.findById(Number(id));
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (req.user.role !== "admin" && trip.user?.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (name !== undefined) trip.name = name;
    if (city !== undefined) trip.city = city;
    if (country !== undefined) trip.country = country;
    if (startDate !== undefined) trip.startDate = startDate;
    if (endDate !== undefined) trip.endDate = endDate;

    if (type !== undefined) trip.type = type;

    const updatedTrip = await tripRepository.save(trip);
    return res.json(updatedTrip);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const trip = await tripRepository.findById(Number(id));
      if (!trip) return res.status(404).json({ message: "Trip not found" });

      if (req.user.role !== "admin" && trip.user?.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await tripRepository.removeTrip(trip);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}