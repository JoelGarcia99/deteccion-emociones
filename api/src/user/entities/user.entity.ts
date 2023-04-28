import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: "Usuario"
})
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  emailRecuperacion: string | undefined;

  @Column()
  password: string;

  @Column()
  nombre: string;

  @Column({ nullable: true, type: "timestamp" })
  fechaNacimiento: Date | undefined;

  @Column({ nullable: true })
  refreshToken: string | undefined;


  @Column({
    default: new Date(Date.now() + 2 * 1000 * 60 * 60).toISOString(),
    type: "timestamp"
  })
  createdAt: Date;

  @Column({
    default: new Date(Date.now() + 2 * 1000 * 60 * 60).toISOString(),
    type: "timestamp"
  })
  updatedAt: Date;
}
