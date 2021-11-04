import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { UserEntity } from "./UserEntity"

@Entity('story')
export class StoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: 'contents'})
  contents: string
  
  @Column({name: 'picture'})
  picture: string

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({name: 'user_id'})
  owner: number

  @Column({name: 'created_at'})
  createdAt: Date

  @Column({name: 'updated_at'})
  updatedAt: Date
}