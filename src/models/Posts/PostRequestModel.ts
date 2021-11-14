class PostRequestModel {
  public userId: number = Number()
  public currentUserId: number = Number()
  public page: number = Number()
  public isCurrent: boolean = Boolean()
}

export default PostRequestModel