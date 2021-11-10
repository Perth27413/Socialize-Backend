import { Router, Response, Request } from "express"
import CommentPageModel from "../models/Comments/CommentPageModel";
import { CommentService } from "../services/CommentService";

export class CommentController {
  public router: Router
  private commentService: CommentService;

  constructor(){
    this.commentService = new CommentService()
    this.router = Router()
    this.routes()
  }

  public routes(){
    this.router.post('/', this.getCommentByPostId)
    this.router.post('/like', this.toggleLike)
    this.router.post('/add', this.addComment)
  }
  
  public getCommentByPostId = async (req: Request<{}, {}, CommentRequestModel>, res: Response<CommentPageModel>) => {
    const comments = await this.commentService.getCommentByPostId(req.body)
    res.send(comments).json()
  }

  public toggleLike = async (req: Request<{}, {}, CommentLikedRequestModel>, res: Response<string>) => {
    const comments = await this.commentService.commentLiked(req.body)
    res.send(comments).json()
  }

  public addComment = async (req: Request<{}, {}, CommentAddRequestModel>, res: Response<CommentPageModel>) => {
    const comments = await this.commentService.addComment(req.body)
    res.send(comments).json()
  }
  
}