import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { RoleEntity } from "./RoleEntity"
import { TypeEntity } from "./TypeEntity"

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => TypeEntity, type => type.id)
  @JoinColumn({name: 'type_id'})
  type: TypeEntity

  @Column({name: 'user_name'})
  userName: string

  @Column({name: 'password'})
  password: string

  @Column({name: 'email'})
  email: string

  @Column({name: 'details'})
  details: string

  @Column({name: 'birthday'})
  birthday: Date

  @Column({name: 'phone_num'})
  phoneNumber: string

  @Column({name: 'profile_picture'})
  profilePicture: string

  @Column({name: 'last_login'})
  lastLogin: Date

  @ManyToOne(() => RoleEntity, role => role.id)
  @JoinColumn({name: 'role_id'})
  role: RoleEntity
  
}