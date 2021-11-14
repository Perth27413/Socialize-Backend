import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { UserEntity } from "./UserEntity"

@Entity('follow')
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({name: 'following'})
  following: UserEntity

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({name: 'followed'})
  followed: UserEntity

}