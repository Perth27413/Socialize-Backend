import { getConnection } from 'typeorm'
import { RoleEntity } from '../database/entities/RoleEntity'
import { TypeEntity } from '../database/entities/TypeEntity'
import { UserEntity } from '../database/entities/UserEntity'
import LoginRequestModel from '../models/LoginRequestModel'
import RegisterRequestModel from '../models/RegisterRequestModel'
import UserModel from '../models/UserModel'
import { RoleRepository } from '../repository/RoleRepository'
import { TypeRepository } from '../repository/TypeRepository'
import { UserRepository } from '../repository/UserRepository'

export class UserService {
  private userRepository: UserRepository
  private typeRepository: TypeRepository
  private roleRepository: RoleRepository

  constructor() {
    this.userRepository = getConnection("postgres").getCustomRepository(UserRepository)
    this.typeRepository = getConnection("postgres").getCustomRepository(TypeRepository)
    this.roleRepository = getConnection("postgres").getCustomRepository(RoleRepository)
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

  public async register(request: RegisterRequestModel): Promise<UserModel> {
    try {
      const isUserNameExist: boolean = await this.checkUserNameExist(request.username)
      if (!isUserNameExist) {
        let newUser: UserEntity = await this.mapRegisterRequestToUserEntity(request) as UserEntity
        const result: UserEntity = await this.userRepository.save(newUser)
        if (result.id) this.mapUserEntityToUserModel(result)
      }
    } catch (error) {
      console.error(error)
    }
    return new UserModel
  }

  public async updateProfile(request: UserModel): Promise<UserModel> {
    try {
      const user: UserEntity = await this.userRepository.findOne({where: {id: request.id}, relations: ['type', 'role']}) as UserEntity
      let newUserProfile: UserEntity = {...user}
      newUserProfile.firstName = request.firstName
      newUserProfile.lastName = request.lastName
      newUserProfile.details = request.details
      newUserProfile.phoneNumber = request.phoneNumber
      newUserProfile.birthday = request.birthday
      const result: UserEntity = await this.userRepository.save({...user, ...newUserProfile})
      return this.mapUserEntityToUserModel(result)
    } catch (error) {
      console.error(error)
    }
    return new UserModel
  }

  private async checkUserNameExist(userName: string): Promise<boolean> {
    const users: Array<UserEntity> = await this.userRepository.find({where: {userName: userName}})
    if (users.length) {
      return true
    }
    return false
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
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      birthday: userEntity.birthday,
      phoneNumber: userEntity.phoneNumber,
      profilePicture: userEntity.profilePicture,
      lastLogin: userEntity.lastLogin,
      roleId: userEntity.role.id,
      typeId: userEntity.type.id
    }
    return result
  }

  private async mapRegisterRequestToUserEntity(request: RegisterRequestModel): Promise<UserEntity> {
    const type: TypeEntity = await this.typeRepository.findOne({where: {id: request.typeId}}) as TypeEntity
    const role: RoleEntity = await this.roleRepository.findOne({where: {id: 1}}) as RoleEntity
    const result: UserEntity = new UserEntity
    result.type = type
    result.userName = request.username
    result.password = request.password
    result.email = request.email
    result.birthday = request.birthDay
    result.phoneNumber = request.phoneNumber
    result.firstName = request.firstName
    result.lastName = request.lastName
    result.role = role
    return result
  }

}