import { Router, Response, Request } from "express"
import StoryModel from "../models/Story/StoryModel";
import StoryRequestModel from "../models/Story/StoryRequestModel";
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
    this.router.post('/add', this.addStory)
  }
  
  public getAll = async (req: Request, res: Response<Array<StoryModel>>) => {
    const storys = await this.storyService.getStory()
    res.send(storys).json()
  }

  public addStory = async (req: Request<{}, {}, StoryRequestModel>, res: Response<StoryModel>) => {
    const storys = await this.storyService.addStory(req.body)
    res.send(storys).json()
  }
  
}