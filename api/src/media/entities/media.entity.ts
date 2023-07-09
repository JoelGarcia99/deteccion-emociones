import { Prediction } from "src/predictions/entities/prediction.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("Media")
export class Media {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column()
  tipo: string;

  @Column()
  createdAt: Date;

  @Column()
  prediccionId: string;

  @OneToOne(() => Prediction, (prediccion) => prediccion.media)
  @JoinColumn({ name: "prediccionId" })
  prediccion: Prediction;
}
