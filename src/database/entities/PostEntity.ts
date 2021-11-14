import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { UserEntity } from "./UserEntity"

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: 'contents'})
  contents: string

  @Column({name: 'picture'})
  picture: string

  @ManyToOne(() => UserEntity, user => user.id, {cascade: true,onDelete: 'CASCADE'})
  @JoinColumn({name: 'owner_id'})
  owner: UserEntity

  @Column({name: 'created_at'})
  createdAt: Date

  @Column({name: 'updated_at'})
  updatedAt: Date
  
}