import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Database {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  creation_date_time: Date;

  @Column()
  pgd_id: number;
}
