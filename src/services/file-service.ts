import {Inject, Injectable} from "@angular/core";
import {IHttpParameters} from "../models/abstractions/i-http-parameters";
import {saveAs} from "file-saver";
import {SERVICE_IDENTIFIERS} from "../app/app.module";
import IHttpService from "./abstractions/i-http-service";

@Injectable({providedIn: 'root'})
export class FileService {
  constructor(@Inject(SERVICE_IDENTIFIERS.IHttpService) private readonly httpService : IHttpService) {
  }

  async downloadFile(url : string, fileType : string, fileName : string, routeParameters? : IHttpParameters, queryParameters? : IHttpParameters) : Promise<void> {
    const response : any = await this.httpService.get(new URL(url), routeParameters, queryParameters, undefined, {responseType: 'blob' as 'json'});
    let blob : any = new Blob([response], {type: fileType});
    saveAs(blob, fileName);
  }
}
