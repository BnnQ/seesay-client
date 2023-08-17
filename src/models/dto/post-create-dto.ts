import {Category} from "../category";

export class PostCreateDto {
    constructor(public description : string, public image : File, public userId : string, signalConnectionId : string, public categories : Category[], public createdAt : Date = new Date()) {
    }

}
