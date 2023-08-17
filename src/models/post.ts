import {Like} from "./like";
import {Category} from "./category";
import {Comment} from "./comment";
import {User} from "./user";

export class Post {
  constructor(public id : number, public imagePath : string, public description : string, public isPremium : boolean, public createdAt : Date, public numberOfViews : number, public numberOfDownloads : number, public numberOfLikes : number, public userId : string, public user : User,  likes? : Like[], public comments? : Comment[], public categories? : Category[]) {

  }

}
