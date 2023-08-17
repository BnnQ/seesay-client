import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LightweightPost} from "../../models/lightweight-post";
import {SERVICE_IDENTIFIERS} from "../app.module";
import {IPostRepository} from "../../services/abstractions/i-post-repository";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit  {
  search : string = '';
  posts : LightweightPost[] = [];
  constructor(activatedRoute : ActivatedRoute, @Inject(SERVICE_IDENTIFIERS.IPostRepository) private readonly postRepository : IPostRepository) {
    this.search = activatedRoute.snapshot.queryParams['q']!;
  }

  page = 1;
  pageSize = 200;
  async ngOnInit(): Promise<void> {
    this.posts = await this.postRepository.getLightweightPostsBySearch(this.search, this.page, this.pageSize);
  }


}
