import {ILikeRepository} from "./abstractions/i-like-repository";
import {Like} from "../models/like";
import {environment} from "../environments/environment";
import {Inject, Injectable} from "@angular/core";
import {SERVICE_IDENTIFIERS} from "../app/app.module";
import IHttpService from "./abstractions/i-http-service";

@Injectable({providedIn: 'root'})
export class ApiLikeRepository implements ILikeRepository {
  private readonly serverApiUrl : string = environment.serverApiUrl;
  constructor(@Inject(SERVICE_IDENTIFIERS.IHttpService) private readonly httpService : IHttpService) {
  }

  addLike(like: Like): Promise<void> {
    return this.httpService.post(new URL(`${this.serverApiUrl}Like/AddLike`), {UserId: like.userId, PostId: like.postId});
  }

  deleteLike(userId: string, postId: number): Promise<void> {
    return this.httpService.delete(new URL(`${this.serverApiUrl}Like/DeleteLike`), {userId: userId, postId: postId});
  }

  getNumberOfLikes(postId: number): Promise<number> {
    return this.httpService.get(new URL(`${this.serverApiUrl}Like/GetNumberOfLikes`), {postId: postId});
  }

  getNumberOfUserLikes(userId: string): Promise<number> {
    return this.httpService.get(new URL(`${this.serverApiUrl}Like/GetNumberOfUserLikes`), {userId: userId});
  }

  async getUserLike(userId: string, postId: number): Promise<boolean> {
    return (await (this.httpService.get(new URL(`${this.serverApiUrl}Like/GetUserLike`),
                                        {userId: userId, postId: postId})) as {
      isUserLikePost: boolean
    }).isUserLikePost;
  }

  getUserLikes(userId: string): Promise<Like[]> {
    return this.httpService.get(new URL(`${this.serverApiUrl}Like/GetUserLikes`), {userId: userId});
  }

}
