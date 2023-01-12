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
  created_at: string;

  @Column()
  pgd_id: number;
}
