import {Post} from "./post";

export class Category {
  constructor(public id : number, public name : string, public posts : Post[]) {
    //empty
  }

}
