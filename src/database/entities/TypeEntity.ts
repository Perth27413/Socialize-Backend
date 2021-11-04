import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('type')
export class TypeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: 'name'})
  name: string
  
}