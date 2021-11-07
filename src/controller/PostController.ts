import { Router, Response, Request } from "express";
import PostPageModel from "../models/Posts/PostPageModel";
import PostRequestModel from "../models/Posts/PostRequestModel";
import { PostService } from "../services/PostService";

export class PostController {
  public router: Router
  private postService: PostService

  constructor(){
    this.postService = new PostService()
    this.router = Router()
    this.routes()
  }

  public routes(){
    this.router.post('/', this.getAllPostByUserId)
    this.router.post('/like', this.toggleLike)
    this.router.post('/add', this.addPost)
  }
  
  public getAllPostByUserId = async (req: Request<{}, {}, PostRequestModel>, res: Response<PostPageModel>) => {
    const posts = await this.postService.getAllPostByUserId(req.body)
    res.send(posts).json()
  } 

  public toggleLike = async (req: Request<{}, {}, PostLikedRequestModel>, res: Response<string>) => {
    const posts = await this.postService.postLiked(req.body)
    res.send(posts).json()
  }

  public addPost = async (req: Request<{}, {}, PostAddRequestModel>, res: Response<string>) => {
    const posts = await this.postService.addPost(req.body)
    res.send(posts).json()
  }
  
}