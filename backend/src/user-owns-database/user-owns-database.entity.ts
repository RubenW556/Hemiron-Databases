import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserOwnsDatabase {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  database_id: string;
}
