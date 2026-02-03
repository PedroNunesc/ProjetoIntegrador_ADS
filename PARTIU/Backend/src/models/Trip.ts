import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Item } from "./Item";

@Entity('trips')
export class Trip {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, nullable: false })
    name: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column({ type: "date" })
    startDate: string;

    @Column({ type: "date" })
    endDate: string;

    @Column({
        type: "enum",
        enum: ["praia", "negocios", "inverno", "outro"],
        default: "outro"
    })
    type!: string;
    
    @Column()
    automaticList!: boolean;

    @ManyToOne(() => User, (user) => user.trips, { onDelete: "CASCADE" })
    user: User;

    @OneToMany(() => Item, (item) => item.trip, { cascade: true })
    items!: Item[];

    constructor(
        name: string,
        city: string,
        country: string,
        startDate: string,
        user: User,
        endDate: string,
        automaticList: boolean
    ) {
        this.name = name;
        this.city = city;
        this.country = country;
        this.startDate = startDate;
        this.endDate = endDate;
        this.user = user;
        this.automaticList = automaticList;
    }
}