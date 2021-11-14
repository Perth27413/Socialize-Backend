import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { PostEntity } from "./PostEntity"
import { UserEntity } from "./UserEntity"

@Entity('post_viewed')
export class PostViewedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PostEntity, post => post.id, {cascade: true,onDelete: 'CASCADE'})
  @JoinColumn({name: 'post_id'})
  post: number

  @ManyToOne(() => UserEntity, user => user.id, {cascade: true,onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: number
}