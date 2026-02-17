import { AppDataSource } from '../config/Data-source';
import { User } from '../models/User';
import { Repository } from 'typeorm';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find({
      order: { id: 'ASC' }
    });
  }

  async findAllWithTrips(): Promise<User[]> {
    return this.repository.find({
      relations: ['trips'],
      order: { id: 'ASC' }
    });
  }

  async findByIdWithTrips(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['trips']
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async createAndSave(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async removeUser(user: User): Promise<User> {
    return this.repository.remove(user);
  }
}