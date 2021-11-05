import { Router, Response, Request, NextFunction } from "express";
import { UserEntity } from "../database/entities/UserEntity";
import LoginRequestModel from "../models/LoginRequestModel";
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
    this.router.get('/:id', this.getUserById)
    this.router.post('/login', this.login)
    this.router.post('/register', this.register)
  }
  
  public getAll = async (req: Request, res: Response<Array<UserEntity>>): Promise<void> => {
    const users = await this.userService.getAllUser();
    res.send(users).json();
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
  
  public register = async (req: Request<{}, {}, RegisterRequestModel>, res: Response<string>): Promise<void> => {
    const status: string = await this.userService.register(req.body)
    res.send(status).json()
  }
}