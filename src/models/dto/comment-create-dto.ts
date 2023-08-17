export class CommentCreateDto {
  constructor(public text : string, public userId : string, public postId : number) {
  }
}
