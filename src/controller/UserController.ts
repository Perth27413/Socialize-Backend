import { Router, Response, Request, NextFunction } from "express";
import { UserEntity } from "../database/entities/UserEntity";
import FollowRequestModel from "../models/Follows/FollowRequestModel";
import PopularResponseModel from "../models/Follows/PopularResponseModel";
import LoginRequestModel from "../models/LoginRequestModel";
import ProfileModel from "../models/Profile/ProfileModel";
import RegisterRequestModel from "../models/RegisterRequestModel";
import UserModel from "../models/UserModel";
import { UserService } from "../services/UserService";

export class UserController {
  public router: Router;
  private userService: UserService; 

  constructor(){
    this.userService = new UserService();
    this.router = Router();
    this.routes();
  }
  
  public routes(){
    this.router.get('/all', this.getAll)
    this.router.get('/popular', this.getPopular)
    this.router.get('/profile', this.getProfileById)
    this.router.get('/:id', this.getUserById)
    this.router.post('/login', this.login)
    this.router.post('/register', this.register)
    this.router.post('/update', this.updateProfile)
    this.router.post('/follow', this.toggleFollow)
    this.router.post('/following', this.getFollowingByUserId)
  }
  
  public getAll = async (req: Request, res: Response<Array<UserEntity>>): Promise<void> => {
    const users = await this.userService.getAllUser()
    res.send(users).json()
  }

  public getPopular = async (req: Request, res: Response<Array<PopularResponseModel>>): Promise<void> => {
    const currentUserId: number = Number(req.query.userId)
    const users = await this.userService.getPopular(currentUserId)
    res.send(users).json()
  }

  public getProfileById = async (req: Request, res: Response<ProfileModel>): Promise<void> => {
    const userId: number = Number(req.query.userId)
    const currentId: number = Number(req.query.currentUserId)
    const user = await this.userService.getProfile(userId, currentId)
    res.send(user).json()
  }

  public getFollowingByUserId = async (req: Request, res: Response<Array<ProfileModel>>): Promise<void> => {
    const userId: number = Number(req.query.userId)
    const user = await this.userService.getFollowingByUserId(userId)
    res.send(user).json()
  }

  public toggleFollow = async (req: Request<{}, {}, FollowRequestModel>, res: Response<ProfileModel>): Promise<void> => {
    const user = await this.userService.toggleFollow(req.body)
    const response = await this.userService.getProfile(req.body.following, req.body.followed)
    res.send(response).json()
  }

  public getUserById = async (req: Request, res: Response<UserEntity>): Promise<void> => {
    const userId: number = Number(req.params.id)
    const user = await this.userService.getUserById(userId)
    res.send(user).json()
  }

  public login = async (req: Request<{}, {}, LoginRequestModel>, res: Response<UserModel>): Promise<void> => {
    const userDetails: UserModel = await this.userService.login(req.body)
    res.send(userDetails).json()
  }
  
  public register = async (req: Request<{}, {}, RegisterRequestModel>, res: Response<UserModel>): Promise<void> => {
    const userDetails: UserModel = await this.userService.register(req.body)
    res.send(userDetails).json()
  }

  public updateProfile = async (req: Request<{}, {}, UserModel>, res: Response<UserModel>): Promise<void> => {
    const userDetails: UserModel = await this.userService.updateProfile(req.body)
    res.send(userDetails).json()
  }

}