import { AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Trip } from "./Trip";
import { Item } from "./Item";

@Entity("users")
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, nullable: false })
    name: string;

    @Column({ length: 100, nullable: false, unique: true })
    email: string;

    @Column({ length: 255, nullable: false })
    password: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: "enum", enum: ["user", "admin", "demo"], default: "user" })
    role!: "user" | "admin" | "demo";

    private originalPassword!: string;

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword(): Promise<void> {
        if (this.password && this.password !== this.originalPassword) {
            const salt = await bcrypt.genSalt(12);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    @AfterLoad()
    private loadOriginalPassword(): void {
        this.originalPassword = this.password;
    }

    @OneToMany(() => Trip, (trip) => trip.user)
    trips?: Trip[];

    @OneToMany(() => Item, (item) => item.user)
    favoriteItems?: Item[];

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}