import { AppDataSource } from "../config/Data-source";
import { Trip } from "../models/Trip";
import { Repository } from "typeorm";

export class TripRepository {
  private repository: Repository<Trip>;

  constructor() {
    this.repository = AppDataSource.getRepository(Trip);
  }

  async findAllWithUser(): Promise<Trip[]> {
    return this.repository.find({
      relations: ["user"],
      order: { id: "ASC" }
    });
  }

  async findByIdWithUser(id: number): Promise<Trip | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["user"]
    });
  }

  async findById(id: number): Promise<Trip | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["user"]
    });
  }

  async findByUserId(userId: number) {
    return this.repository.find({
      where: { user: { id: userId } },
      relations: ["user"],
      order: { startDate: "ASC" }
    });
  }

  async createAndSave(data: Partial<Trip>): Promise<Trip> {
    const trip = this.repository.create(data);
    return this.repository.save(trip);
  }

  async save(trip: Trip): Promise<Trip> {
    return this.repository.save(trip);
  }

  async removeTrip(trip: Trip): Promise<Trip> {
    return this.repository.remove(trip);
  }
}