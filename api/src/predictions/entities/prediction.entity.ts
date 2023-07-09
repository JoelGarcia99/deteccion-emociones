import { Media } from "src/media/entities/media.entity";
import { Resource } from "src/resources/entities/resource.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Prediccion")
export class Prediction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  usuarioId: string;

  @Column()
  emocionDetectada: string;

  @Column()
  recursoId: string;

  @Column()
  createdAt: Date;

  @OneToOne(() => Media, (media) => media.prediccion, { cascade: true, eager: true })
  media: Media;

  @OneToOne(() => Resource, { eager: true })
  @JoinColumn({ name: "recursoId" })
  resource: Resource;
}
