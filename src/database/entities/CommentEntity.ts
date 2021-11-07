import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { PostEntity } from "./PostEntity"
import { UserEntity } from "./UserEntity"

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PostEntity, post => post.id)
  @JoinColumn({name: 'post_id'})
  post: PostEntity

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({name: 'owner_id'})
  owner: UserEntity

  @Column({name: 'contents'})
  contents: string

  @Column({name: 'created_at'})
  createdAt: Date

  @Column({name: 'updated_at'})
  updatedAt: Date

}