import {Like} from "./like";
import {Category} from "./category";
import {Post} from "./post";
import {SocialMediaLink} from "./social-media-link";

export class User {
  constructor(public id : string, public firstName : string, public lastName : string, public userName : string, public hasPremium : boolean, public avatarImagePath : string, public likes? : Like[], public comments? : Comment[], public posts? : Post[], public socialMediaLinks? : SocialMediaLink[], public location? : string, public bio? : string) {

  }
}
