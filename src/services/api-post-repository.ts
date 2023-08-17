import { IPostRepository } from './abstractions/i-post-repository';
import { LightweightPost } from '../models/lightweight-post';
import { Post } from '../models/post';
import { Inject, Injectable } from '@angular/core';
import { SERVICE_IDENTIFIERS } from '../app/app.module';
import IHttpService from './abstractions/i-http-service';
import { environment } from '../environments/environment';
import { Like } from '../models/like';

@Injectable({ providedIn: 'root' })
export class ApiPostRepository implements IPostRepository {
  private readonly serverApiUrl: string = environment.serverApiUrl;
  constructor(
    @Inject(SERVICE_IDENTIFIERS.IHttpService)
    private readonly httpService: IHttpService
  ) {}

  getNumberOfPostPages(pageSize: number = 21): Promise<number> {
    return this.httpService.get(
      new URL(`${this.serverApiUrl}Post/GetNumberOfPostPages`),
      { pageSize: pageSize }
    );
  }

  getNumberOfUserPosts(userId: string): Promise<number> {
    return this.httpService.get(
      new URL(`${this.serverApiUrl}Post/GetNumberOfUserPosts`),
      { userId: userId }
    );
  }

  getLightweightCategoryPosts(
    categoryId: number,
    page: number = 1,
    pageSize: number = 21
  ): Promise<LightweightPost[]> {
    return this.httpService.post(new URL(`${this.serverApiUrl}Post/GetPosts`), {
      categoryId: categoryId,
      page: page,
      pageSize: pageSize,
    });
  }

  getLightweightLikedPosts(
    likes: Like[],
    page: number,
    pageSize: number
  ): Promise<LightweightPost[]> {
    return this.httpService.post(new URL(`${this.serverApiUrl}Post/GetPosts`), {
      likes: likes,
      page: page,
      pageSize: pageSize,
    });
  }

  getLightweightPosts(
    page: number = 1,
    pageSize: number = 21
  ): Promise<LightweightPost[]> {
    return this.httpService.post(new URL(`${this.serverApiUrl}Post/GetPosts`), {
      page: page,
      pageSize: pageSize,
    });
  }

  getLightweightUserPosts(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<LightweightPost[]> {
    return this.httpService.post(new URL(`${this.serverApiUrl}Post/GetPosts`), {
      userId: userId,
      page: page,
      pageSize: pageSize,
    });
  }

  getPost(id: number): Promise<Post> {
    return this.httpService.get(new URL(`${this.serverApiUrl}Post/GetPost`), {
      id: id,
    });
  }

  async createPost(formData: FormData): Promise<Post> {
    const post = await this.httpService
      .post<Post>(
        new URL(`${this.serverApiUrl}Post/CreatePost`),
        formData,
        undefined,
        undefined,
        { 'Content-Type': 'multipart/form-data' }
      );

    return post as Post;
  }

  deletePost(id: number): Promise<void> {
    return this.httpService.delete(
      new URL(`${this.serverApiUrl}Post/DeletePost`),
      { id: id }
    );
  }

  getLightweightPostsBySearch(
    search: string,
    page: number,
    pageSize: number
  ): Promise<LightweightPost[]> {
    return this.httpService.post(new URL(`${this.serverApiUrl}Post/GetPosts`), {
      search: search,
      page: page,
      pageSize: pageSize,
    });
  }
}
