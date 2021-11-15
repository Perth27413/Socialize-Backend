import { getConnection } from 'typeorm';
import { StoryEntity } from '../database/entities/StoryEntity';
import { UserEntity } from '../database/entities/UserEntity';
import StoryModel from '../models/Story/StoryModel';
import UserModel from '../models/UserModel';
import { StoryRepository } from '../repository/StoryRepository';
import { UserRepository } from '../repository/UserRepository';

export class StoryService {
  private storyRepository: StoryRepository
  private userRepository: UserRepository

  constructor() {
    this.storyRepository = getConnection("postgres").getCustomRepository(StoryRepository)
    this.userRepository = getConnection("postgres").getCustomRepository(UserRepository)
  }
  
  public async getStory(): Promise<Array<StoryModel>> {
    try {
      const results: Array<StoryModel> = []
      const storyList: Array<StoryEntity> = await this.storyRepository.find({relations: ['owner']})
      for (const item of storyList) {
        const user: UserEntity = await this.userRepository.findOne({where: {id: item.owner.id}, relations: ['role', 'type']}) as UserEntity
        let story: StoryModel = {
          storyId: item.id,
          contents: item.contents,
          picture: item.picture,
          owner: this.mapUserEntityToUserModel(user)
        }
        results.push(story)
      }
      return results
    } catch (error) {
      console.error(error)
    }
    return []
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
}