import CommentModel from "./CommentModel"

class CommentPageModel {
  public postId: number = Number()
  public comments: Array<CommentModel> = new Array<CommentModel>()
}

export default CommentPageModel