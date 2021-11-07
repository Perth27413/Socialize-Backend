class PostAddRequestModel {
  public userId: number = Number()
  public contents: string = String()
  public picture: Array<string> = new Array<string>()
}