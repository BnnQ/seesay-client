import {Like} from "../../models/like";

export interface ILikeRepository {
  getUserLike(userId : string, postId : number) : Promise<boolean>;
  getNumberOfLikes(postId : number) : Promise<number>;
  getNumberOfUserLikes(userId : string) : Promise<number>;
  getUserLikes(userId : string) : Promise<Like[]>;
  addLike(like : Like) : Promise<void>;
  deleteLike(userId : string, postId : number) : Promise<void>;
}
