class ProfileModel {
  public userId: number = Number()
  public profilePicture: string = String()
  public firstName: string = String()
  public lastName: string = String()
  public details: string = String()
  public post: number = Number()
  public followers: number = Number()
  public following: number = Number()
  public isFollow: boolean = Boolean()
}

export default ProfileModel