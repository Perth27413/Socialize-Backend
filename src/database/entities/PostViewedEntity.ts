import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { PostEntity } from "./PostEntity"
import { UserEntity } from "./UserEntity"

@Entity('post_viewed')
export class PostViewedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PostEntity, post => post.id)
  @JoinColumn({name: 'post_id'})
  post: number

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({name: 'user_id'})
  user: number
}