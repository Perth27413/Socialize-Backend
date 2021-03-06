import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { CommentEntity } from "./CommentEntity"
import { UserEntity } from "./UserEntity"

@Entity('comment_liked')
export class CommentLikedEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => CommentEntity, comment => comment.id)
  @JoinColumn({name: 'comment_id'})
  comment: number

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({name: 'user_id'})
  userId: number

}