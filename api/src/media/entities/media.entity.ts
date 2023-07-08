import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Media")
export class Media {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column()
  tipo: string;
}
