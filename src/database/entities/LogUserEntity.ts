import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { UserEntity } from "./UserEntity"

@Entity('log_user')
export class LogUserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({name: 'user_id'})
  user: number

  @Column({name: 'login_date'})
  loginDate: Date
}