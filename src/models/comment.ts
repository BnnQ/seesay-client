import {User} from "./user";

export class Comment {
  constructor(public id : number, public text : string, public createdAt : Date, public userId : string, public postId : number, public user? : User) {
    //empty
  }

}
