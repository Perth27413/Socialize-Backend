import PostModel from "./PostModel"

class PostPageModel {
  public currentPage: number = Number()
  public pageItem: number = Number()
  public totalPage: number = Number()
  public posts: Array<PostModel> = new Array<PostModel>()
}

export default PostPageModel