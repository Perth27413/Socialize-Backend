import { Router, Response, Request } from "express"
import { CommentService } from "../services/CommentService";
import { TypeService } from "../services/TypeService"

export class CommentController {
  public router: Router
  private commentService: CommentService;

  constructor(){
    this.commentService = new CommentService()
    this.router = Router()
    this.routes()
  }

  public routes(){
    this.router.get('/', this.getCommentByPostId)
  }
  
  public getCommentByPostId = async (req: Request<{}, {}, CommentRequestModel>, res: Response) => {
    const posts = await this.commentService.getCommentByPostId(req.body);
    res.send(posts).json()
  } 
  
}