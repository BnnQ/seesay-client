import {Comment} from "../../models/comment";
import {CommentCreateDto} from "../../models/dto/comment-create-dto";

export interface ICommentRepository {
  getComment(id : number) : Promise<Comment>;
  getComments(postId : number) : Promise<Comment[]>;
  addComment(comment : CommentCreateDto) : Promise<Comment>;
  deleteComment(id : number) : Promise<void>;
}
