import { getConnection } from 'typeorm'
import { FollowEntity } from '../database/entities/FollowEntity'
import { PostEntity } from '../database/entities/PostEntity'
import { RoleEntity } from '../database/entities/RoleEntity'
import { TypeEntity } from '../database/entities/TypeEntity'
import { UserEntity } from '../database/entities/UserEntity'
import FollowRequestModel from '../models/Follows/FollowRequestModel'
import PopularResponseModel from '../models/Follows/PopularResponseModel'
import PopularUserModel from '../models/Follows/PopularUserModel'
import LoginRequestModel from '../models/LoginRequestModel'
import ProfileModel from '../models/Profile/ProfileModel'
import RegisterRequestModel from '../models/RegisterRequestModel'
import UserModel from '../models/UserModel'
import { FollowRepository } from '../repository/FollowRepository'
import { PostRepository } from '../repository/PostRepository'
import { RoleRepository } from '../repository/RoleRepository'
import { TypeRepository } from '../repository/TypeRepository'
import { UserRepository } from '../repository/UserRepository'

export class UserService {
  private userRepository: UserRepository
  private typeRepository: TypeRepository
  private roleRepository: RoleRepository
  private followRepository: FollowRepository
  private postRepository: PostRepository

  constructor() {
    this.userRepository = getConnection("postgres").getCustomRepository(UserRepository)
    this.typeRepository = getConnection("postgres").getCustomRepository(TypeRepository)
    this.roleRepository = getConnection("postgres").getCustomRepository(RoleRepository)
    this.followRepository = getConnection("postgres").getCustomRepository(FollowRepository)
    this.postRepository = getConnection("postgres").getCustomRepository(PostRepository)
  }
  
  public async getAllUser(): Promise<Array<UserModel>> {
    const userList: Array<UserEntity> = await this.userRepository.find({relations: ['type', 'role']})
    const results: Array<UserModel> = []
    for await (const item of userList) {
      let user: UserModel = this.mapUserEntityToUserModel(item)
      results.push(user)
    }
    return  results
  }

  public async getUserById(userId: number): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ['type', 'role']}) || new UserEntity
    return  user
  }

  public async getProfile(userId: number, currentUserId: number): Promise<ProfileModel> {
    try {
      const user: UserEntity = await this.userRepository.findOne({where: {id: userId}, relations: ['type', 'role']}) as UserEntity
      const posts: Array<PostEntity> = await this.postRepository.find({where: {owner: {id: userId}}})
      const following: Array<FollowEntity> = await this.followRepository.find({where: {followed: userId}})
      const followers: Array<FollowEntity> = await this.followRepository.find({where: {following: userId}})
      const isFollow: boolean = (await this.followRepository.find({where: {following: userId, followed: currentUserId}})).length > 0 
      const result: ProfileModel = {
        userId: user.id,
        profilePicture: user.profilePicture,
        firstName: user.firstName,
        lastName: user.lastName,
        details: user.details,
        post: posts.length,
        followers: followers.length,
        following: following.length,
        isFollow: isFollow
      }
      return result
    } catch (error) {
      console.error(error)
    }
    return new ProfileModel
  }

  public async getFollowingByUserId(userId: number): Promise<Array<ProfileModel>> {
    try {
      const result: Array<ProfileModel> = []
      const followLists: Array<FollowEntity> = await this.followRepository.find({where: {followed: userId}, relations: ['following', 'followed']})
      for await (const item of followLists) {
        let follow: ProfileModel = await this.getProfile(item.following.id, userId)
        result.push(follow)
      }
      return result
    } catch (error) {
      console.error(error)
    }
    return []
  }  

  public async toggleFollow(request: FollowRequestModel) {
    try {
      let follows: Array<FollowEntity> = await this.followRepository.find({where: {followed: request.followed, following: request.following}})
      if (follows.length) {
        await this.followRepository.remove(follows[0])
      } else {
        let newFollow: FollowEntity = new FollowEntity
        newFollow.followed = await this.userRepository.findOne({where: {id: request.followed}, relations: ['type', 'role']}) as UserEntity
        newFollow.following = await this.userRepository.findOne({where: {id: request.following}, relations: ['type', 'role']}) as UserEntity
        await this.followRepository.save(newFollow)
      }
    } catch (error) {
      console.error(error)
    }
  }

  public async getPeopleMayKnow(currentUserId: number): Promise<Array<UserModel>> {
    try {
      let allUser: Array<UserModel> = await this.getAllUser()
      const removeIndexs: Array<number> = []
      for await (const item of allUser) {
        const follow: Array<FollowEntity> = await this.followRepository.find({where: {following: {id: item.id}, followed: {id: currentUserId}}})
        if (follow.length || item.id === currentUserId) {
          let removeIndex: number = allUser.findIndex(it => it.id === item.id)
          removeIndexs.push(removeIndex)
        }
      }
      allUser = this.filterLists(allUser, removeIndexs)
      if (allUser.length >= 10) return allUser.slice(0, 11)
      return allUser
    } catch (error) {
      console.error(error)
    }
    return []
  }

  private filterLists(allUser: Array<UserModel>, removeIndexs: Array<number>): Array<UserModel> {
    const results: Array<UserModel> = [...allUser]
    removeIndexs = removeIndexs.reverse()
    removeIndexs.forEach(item => {
      results.splice(item, 1)
    })
    return results
  }

  public async getPopular(currentUserId: number): Promise<Array<PopularResponseModel>> {
    try {
      const follows: Array<FollowEntity> = await this.followRepository.find({relations: ['following', 'followed']})
      const popularLists: Array<PopularUserModel> = await this.findPopular(follows, currentUserId)
      return this.mapPopularToResponse(popularLists)
    } catch (error) {
      console.error(error)
    }
    return []
  }

  private async findPopular(follows: Array<FollowEntity>, currentUserId: number): Promise<Array<PopularUserModel>> {
    let popularList: Array<PopularUserModel> = []
    for await (const item of follows) {
      const currentFollows: Array<FollowEntity> = await this.followRepository.find({where: {following: item.following, followed: currentUserId}})
      if (!currentFollows.length) {
        const index: number = popularList.findIndex(i => i.user.id === item.following.id)
        if (item.following.id !== currentUserId) {
          if (index >= 0) {
            popularList[index].count = popularList[index].count + 1
          } else {
            let follow: PopularUserModel = {
              user: item.following,
              count: 1
            }
            popularList.push(follow)
          }
        }
      }
    }
    return popularList
  }

  private mapPopularToResponse(popularList: Array<PopularUserModel>): Array<PopularResponseModel> {
    let results: Array<PopularResponseModel> = []
    popularList.forEach((item: PopularUserModel, index: number) => {
      if (index <= 5) {
        const user: PopularResponseModel = {
          userId: item.user.id,
          profilePicture: item.user.profilePicture,
          firstName: item.user.firstName,
          lastName: item.user.lastName,
          details: item.user.details,
          isFollow: false
        }
        results.push(user)
      }
    })
    return results
  }

  public async login(request: LoginRequestModel): Promise<UserModel> {
    try {
      let result: UserEntity
      if (request.typeId === 2) {
        const user: Array<UserEntity> = await this.userRepository.find({where: {email: request.username, type: {id: request.typeId}}})
        if (user.length) {
          return this.mapUserEntityToUserModel(user[0])
        }
      }
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
      if (request.typeId === 2) {
        const user: Array<UserEntity> = await this.userRepository.find({where: {email: request.email, type: {id: request.typeId}}})
        if (user.length) {
          return this.mapUserEntityToUserModel(user[0])
        }
      }
      let isUserNameExist: boolean = false
      if (request.username) {
        isUserNameExist = await this.checkUserNameExist(request.username)
      }
      if (!isUserNameExist) {
        let newUser: UserEntity = await this.mapRegisterRequestToUserEntity(request) as UserEntity
        const result: UserEntity = await this.userRepository.save(newUser)
        if (result.id) {
          return this.mapUserEntityToUserModel(result)
        }
      }
    } catch (error) {
      console.error(error)
    }
    return new UserModel
  }

  public async updateProfilePicture(request: UserModel): Promise<UserModel> {
    try {
      const user: UserEntity = await this.userRepository.findOne({where: {id: request.id}, relations: ['type', 'role']}) as UserEntity
      const newDetails: UserEntity = {...user}
      newDetails.profilePicture = request.profilePicture
      const response: UserEntity = await this.userRepository.save({...user, ...newDetails})
      return this.mapUserEntityToUserModel(response)
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
    result.profilePicture = request.pictureProfile ? request.pictureProfile : '/assets/image/default.jpg'
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