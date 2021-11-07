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
    this.router.post('/', this.getAllPostByUserId);
  }
  
  public getAllPostByUserId = async (req: Request<{}, {}, PostRequestModel>, res: Response<PostPageModel>) => {
    const posts = await this.postService.getAllPostByUserId(req.body)
    res.send(posts).json();
  } 
  
}