import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {LightweightPost} from "../../models/lightweight-post";
import {ActivatedRoute} from "@angular/router";
import {SERVICE_IDENTIFIERS} from "../app.module";
import {IPostRepository} from "../../services/abstractions/i-post-repository";
import {Category} from "../../models/category";
import {ICategoryRepository} from "../../services/abstractions/i-category-repository";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {
  categoryId : number = 0;
  category? : Category;
  posts : LightweightPost[] = [];
  constructor(activatedRoute : ActivatedRoute, @Inject(SERVICE_IDENTIFIERS.IPostRepository) private readonly postRepository : IPostRepository, @Inject(SERVICE_IDENTIFIERS.ICategoryRepository) private readonly categoryRepository : ICategoryRepository) {
    this.categoryId = parseInt(activatedRoute.snapshot.paramMap.get('id')!);
  }

  page = 1;
  pageSize = 200;
  async ngOnInit(): Promise<void> {
    this.category = await this.categoryRepository.getCategory(this.categoryId);
    this.posts = await this.postRepository.getLightweightCategoryPosts(this.categoryId, this.page, this.pageSize);
  }


}
