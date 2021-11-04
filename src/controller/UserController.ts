import { Router, Response, Request, NextFunction } from "express";
import { UserEntity } from "../database/entities/UserEntity";
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
  
}