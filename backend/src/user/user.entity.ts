import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User{
    @PrimaryGeneratedColumn("uuid")
    user_id: string;

    @Column()
    username: string;
}