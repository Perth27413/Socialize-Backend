import CommentOwnerModel from "./CommentOwnerModel"

class CommentModel {
  public id: number = Number()
  public contents: string = String()
  public date: Date = new Date
  public liked: number = Number()
  public isLiked: boolean = Boolean()
  public owner: CommentOwnerModel = new CommentOwnerModel
}

export default CommentModel