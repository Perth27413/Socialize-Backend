import PostOwnerModel from "./PostOwnerModel"

class PostModel {
  public id: number = Number()
  public contents: string = String()
  public picture: Array<string> = new Array<string>()
  public date: Date = new Date
  public liked: number = Number()
  public isLiked: boolean = Boolean()
  public viewed: number = Number()
  public isViewed: boolean = Boolean()
  public owner: PostOwnerModel = new PostOwnerModel
}

export default PostModel