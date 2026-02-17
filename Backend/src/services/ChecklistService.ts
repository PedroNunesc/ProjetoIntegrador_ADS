import { AppDataSource } from "../config/Data-source";
import { Item } from "../models/Item";
import { Trip } from "../models/Trip";
import { User } from "../models/User";
import { DeepPartial } from "typeorm";

export class ChecklistService {
  static async generateChecklist(
    temperature: number,
    autoGenerate: boolean,
    trip: Trip,
    user: User
  ): Promise<Item[]> {
    const itemRepo = AppDataSource.getRepository(Item);

    if (!autoGenerate && (!trip.type || trip.type === "outro")) {
      return [];
    }

    const fixedItems = [
      { name: "Documentos", category: "documentos" },
      { name: "Remédios", category: "remedios" },
      { name: "Carregador", category: "eletronicos" },
      { name: "Produtos de Higiene", category: "higiene" },
    ];

    let clothingItems: { name: string; category: string }[] = [];

    if (autoGenerate) {
      if (temperature >= 23) {
        clothingItems = [
          { name: "Blusas", category: "roupas" },
          { name: "Bermudas", category: "roupas" },
          { name: "Calças", category: "roupas" },
          { name: "Roupas íntimas", category: "roupas" },
          { name: "Tênis", category: "calcados" },
          { name: "Chinelos", category: "calcados" },
        ];
      } else if (temperature >= 13) {
        clothingItems = [
          { name: "Blusas", category: "roupas" },
          { name: "Blusas de manga longa", category: "roupas" },
          { name: "Bermudas", category: "roupas" },
          { name: "Calças", category: "roupas" },
          { name: "Roupas íntimas", category: "roupas" },
          { name: "Tênis", category: "calcados" },
          { name: "Chinelos", category: "calcados" },
        ];
      } else {
        clothingItems = [
          { name: "Camisetas de manga longa", category: "roupas" },
          { name: "Calças", category: "roupas" },
          { name: "Roupas íntimas", category: "roupas" },
          { name: "Tênis", category: "calcados" },
          { name: "Casaco", category: "roupas" },
        ];
      }
    }

    const typeBasedItems: Record<string, { name: string; category: string }[]> = {
      praia: [
        { name: "Roupas de Banho", category: "roupas" },
        { name: "Toalha", category: "outros" },
        { name: "Óculos de sol", category: "acessorios" },
        { name: "Protetor solar", category: "outros" },
      ],
      negocios: [
        { name: "Notebook", category: "eletronicos" },
        { name: "Roupas formais", category: "roupas" },
        { name: "Cartões de visita", category: "outros" },
      ],
      inverno: [
        { name: "Gorro", category: "acessorios" },
        { name: "Luvas", category: "acessorios" },
        { name: "Cachecol", category: "acessorios" },
        { name: "Botas", category: "calcados" },
      ],
      outro: [],
    };

    const combinedItems = [
      ...(autoGenerate || (trip.type && trip.type !== "outro") ? fixedItems : []),
      ...clothingItems,
      ...(trip.type && trip.type !== "outro" ? typeBasedItems[trip.type] || [] : []),
    ];

    if (combinedItems.length === 0) return [];

    const createdItems = combinedItems.map((f) =>
      itemRepo.create({
        name: f.name,
        category: f.category,
        isPacked: false,
        trip,
        user,
      } as DeepPartial<Item>)
    );

    await itemRepo.save(createdItems);

    return createdItems;
  }
}