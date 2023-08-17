import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { LightweightPost } from '../../models/lightweight-post';
import { SERVICE_IDENTIFIERS } from '../app.module';
import { IPostRepository } from '../../services/abstractions/i-post-repository';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { ScreenService } from '../../services/screen-service';
import { RedirectUtils } from 'src/utils/redirect-utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  async loadPosts(): Promise<void> {
    const newPosts = await this.postRepository.getLightweightPosts(
      this.page,
      this.pageSize
    );
    this.posts = [...this.posts, ...newPosts];
    this.page++;
  }

  async ngOnInit(): Promise<void> {
    this.maxPage = await this.postRepository.getNumberOfPostPages(
      this.pageSize
    );
    await this.loadPosts();
    this.screenService.isScrollAtBottom.subscribe(async (isScrollAtBottom) => {
      if (isScrollAtBottom && this.page <= this.maxPage) await this.loadPosts();
    });
  }
  posts: LightweightPost[] = [];
  selectedPostId?: number = undefined;

  page = 1;
  pageSize = 9;
  maxPage = 1;

  constructor(
    @Inject(SERVICE_IDENTIFIERS.IPostRepository)
    private readonly postRepository: IPostRepository,
    private readonly activatedRoute: ActivatedRoute,
    private readonly screenService: ScreenService
  ) {
    const stringSelectedPostId =
      this.activatedRoute.snapshot.paramMap.get('id');
    if (stringSelectedPostId)
      this.selectedPostId = parseInt(stringSelectedPostId);
  }

  searchInput?: string;
  search() {
    if (this.searchInput) RedirectUtils.redirectToSearch(this.searchInput);
  }

  protected readonly faSearch = faSearch;
}
