import { getConnection } from 'typeorm'
import { UserEntity } from '../database/entities/UserEntity'
import { UserRepository } from '../repository/UserRepository'

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = getConnection("postgres").getCustomRepository(UserRepository)
  }
  
  public async getAllUser(): Promise<Array<UserEntity>> {
    return await this.userRepository.find({relations: ['type', 'role']}) || new UserEntity
  }

  public async getUserById(userId: number): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ['type', 'role']}) || new UserEntity
    return  user
  }

}