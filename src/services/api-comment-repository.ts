import {ICommentRepository} from "./abstractions/i-comment-repository";
import {environment} from "../environments/environment";
import {Inject, Injectable} from "@angular/core";
import {SERVICE_IDENTIFIERS} from "../app/app.module";
import IHttpService from "./abstractions/i-http-service";
import {Comment} from '../models/comment';
import {CommentCreateDto} from "../models/dto/comment-create-dto";

@Injectable({providedIn: 'root'})
export class ApiCommentRepository implements ICommentRepository {
  private readonly serverApiUrl : string = environment.serverApiUrl;
  constructor(@Inject(SERVICE_IDENTIFIERS.IHttpService) private readonly httpService : IHttpService) {
  }

  async addComment(comment: CommentCreateDto): Promise<Comment> {
    return await this.httpService.post<Comment>(new URL(`${this.serverApiUrl}Comment/AddComment`), comment);
  }

  deleteComment(id: number): Promise<void> {
    return this.httpService.delete(new URL(`${this.serverApiUrl}Comment/DeleteComment`), {id: id});
  }

  getComment(id: number): Promise<Comment> {
    return this.httpService.get(new URL(`${this.serverApiUrl}Comment/GetComment`), {id: id})
  }

  getComments(postId: number): Promise<Comment[]> {
    return this.httpService.get(new URL(`${this.serverApiUrl}Comment/GetComments`), {postId: postId});
  }

}
