import UserModel from "../UserModel"

class StoryModel {
  public storyId: number = Number()
  public contents: string = String()
  public picture: string = String()
  public owner: UserModel = new UserModel
}

export default StoryModel