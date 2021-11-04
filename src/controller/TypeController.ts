import { Router, Response, Request } from "express";
import { TypeService } from "../services/TypeService";

export class TypeController {
  public router: Router;
  private typeService: TypeService; 

  constructor(){
    this.typeService = new TypeService(); // Create a new instance of PostController
    this.router = Router();
    this.routes();
  }

  
  public getAll = async (req: Request, res: Response) => {
    const posts = await this.typeService.getAllType();
    res.send(posts).json();
  } 
  
  public routes(){
    this.router.get('/', this.getAll);
  }
}