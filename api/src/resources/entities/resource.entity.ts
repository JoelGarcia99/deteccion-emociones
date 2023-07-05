import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Recurso")
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The name of the resource. It's not the type (video, game, etc) but
   * the name of the resource itself, for example "Músicas infantiles" 
   * instead of "video".
   */
  @Column()
  nombre: string;

  /**
   * It referes to the type of resource which is part of an enum
   * defined at DB level
   */
  @Column()
  tipo: string;

  /**
   * Only used in case the resource is not embeded so we have to 
   * access it using an URL
   */
  @Column({ nullable: true })
  url?: string;

  /**
  * It refers to the videogame/video which is embeded within
  * the prediciton screen
  */
  @Column({ nullable: true })
  embebido?: string;

}
