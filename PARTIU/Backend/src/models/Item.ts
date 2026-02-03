  import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
  import { Trip } from "./Trip";
  import { User } from "./User";

   @Entity("items")
  export class Item {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 100, default: "outros" })
    category!: string;

    @Column({ default: false })
    isPacked!: boolean;

    @ManyToOne(() => Trip, (trip) => trip.items, { onDelete: "CASCADE" })
    trip!: Trip;

    @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
    user?: User;

    constructor(name: string, category: string, user?: User) {
      this.name = name;
      this.category = category;
      this.user = user;
      this.isPacked = false;
    }
  }