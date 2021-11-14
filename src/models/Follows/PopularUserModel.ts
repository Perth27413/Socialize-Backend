import { UserEntity } from "../../database/entities/UserEntity"

class PopularUserModel {
  public user: UserEntity = new UserEntity
  public count: number = Number()
}

export default PopularUserModel