export class UserRegisterDto {
  constructor(public firstName : string, public lastName : string, public email : string, public userName : string, public password : string, public confirmPassword : string) {
  }
}
