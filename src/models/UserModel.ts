class UserModel {
    public id: number = Number()
    public userName: string = String()
    public email: string = String()
    public details: string = String()
    public firstName: string = String()
    public lastName: string = String()
    public birthday: Date = new Date()
    public phoneNumber: string = String()
    public profilePicture:string = String()
    public lastLogin: Date = new Date()
    public roleId: number = Number()
    public typeId: number = Number()
}

export default UserModel