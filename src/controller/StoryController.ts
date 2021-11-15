import { Router, Response, Request } from "express"
import StoryModel from "../models/Story/StoryModel";
import { StoryService } from "../services/StoryService";

export class StoryController {
  public router: Router
  private storyService: StoryService

  constructor(){
    this.storyService = new StoryService()
    this.router = Router()
    this.routes()
  }

  public routes(){
    this.router.get('/', this.getAll)
  }
  
  public getAll = async (req: Request, res: Response<Array<StoryModel>>) => {
    const storys = await this.storyService.getStory()
    res.send(storys).json()
  } 
  
}