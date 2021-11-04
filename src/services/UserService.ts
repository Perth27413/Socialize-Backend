import { getConnection } from 'typeorm'
import { UserEntity } from '../database/entities/UserEntity'
import LoginRequestModel from '../models/LoginRequestModel'
import UserModel from '../models/UserModel'
import { TypeRepository } from '../repository/TypeRepository'
import { UserRepository } from '../repository/UserRepository'

export class UserService {
  private userRepository: UserRepository
  private typeRepository: TypeRepository

  constructor() {
    this.userRepository = getConnection("postgres").getCustomRepository(UserRepository)
    this.typeRepository = getConnection("postgres").getCustomRepository(TypeRepository)
  }
  
  public async getAllUser(): Promise<Array<UserEntity>> {
    return await this.userRepository.find({relations: ['type', 'role']}) || new UserEntity
  }

  public async getUserById(userId: number): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ['type', 'role']}) || new UserEntity
    return  user
  }

  public async login(request: LoginRequestModel): Promise<UserModel> {
    try {
      let result: UserEntity
      if (this.checkIsEmail(request.username)) {
        result = await this.userRepository.findOne({where: {email: request.username, password: request.password}, relations: ['type', 'role']}) as UserEntity
      } else {
        result = await this.userRepository.findOne({where: {userName: request.username, password: request.password}, relations: ['type', 'role']}) as UserEntity
      }
      result = await this.updateLastLogin(result)
      return this.mapUserEntityToUserModel(result)
    } catch (error) {
      return new UserModel
    }
  }

  private async updateLastLogin(result: UserEntity): Promise<UserEntity> {
    let newResult: UserEntity = result
    newResult.lastLogin = new Date()
    return await this.userRepository.save({...result, ...newResult})
  }

  private checkIsEmail(email: string): boolean {
    const regex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
  }

  private mapUserEntityToUserModel(userEntity: UserEntity): UserModel {
    const result: UserModel = {
      id: userEntity.id,
      userName: userEntity.userName,
      email: userEntity.email,
      details: userEntity.details,
      birthday: userEntity.birthday,
      phoneNumber: userEntity.phoneNumber,
      profilePicture: userEntity.profilePicture,
      lastLogin: userEntity.lastLogin,
      roleId: userEntity.role.id,
      typeId: userEntity.type.id
    }
    return result
  }

}