import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import * as bcrypt from "bcryptjs";

const userRepository = new UserRepository();

export class UserController {

  async listAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userRepository.findAll();
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userRepository.findAllWithTrips();
      return res.json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async show(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id) || req.user.id;

      if (req.user.role !== "admin" && id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const user = await userRepository.findByIdWithTrips(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email and password are required" });
      }

      const userExists = await userRepository.findByEmail(email);
      if (userExists) {
        return res.status(409).json({ message: "Email already in use" });
      }

      const user = await userRepository.createAndSave({
        name,
        email,
        password,
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
  const id = Number(req.params.id) || req.user.id;

  const user = await userRepository.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email, password, currentPassword } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;

  if (password) {
    if (!currentPassword) {
      return res.status(400).json({
        message: "Senha atual é obrigatória para trocar a senha"
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Senha atual incorreta"
      });
    }

    user.password = password;
  }

  const updatedUser = await userRepository.save(user);
  return res.json(updatedUser);
}

  


  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id) || req.user.id;

      if (req.user.role !== "admin" && id !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const user = await userRepository.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await userRepository.removeUser(user);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}