class RegisterRequestModel {
  public username: string = String()
  public password: string = String()
  public email: string = String()
  public firstName: string = String()
  public lastName: string = String()
  public phoneNumber: string = String()
  public birthDay: Date = new Date()
  public typeId: number = Number()
  public pictureProfile: string = String()
}

export default RegisterRequestModel