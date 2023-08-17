import { LightweightPost } from '../../models/lightweight-post';
import { Post } from '../../models/post';
import { Like } from '../../models/like';

export interface IPostRepository {
  getNumberOfPostPages(pageSize: number): Promise<number>;
  getNumberOfUserPosts(userId: string): Promise<number>;
  getLightweightPosts(
    page: number,
    pageSize: number
  ): Promise<LightweightPost[]>;
  getLightweightUserPosts(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<LightweightPost[]>;
  getLightweightLikedPosts(
    likes: Like[],
    page: number,
    pageSize: number
  ): Promise<LightweightPost[]>;
  getLightweightCategoryPosts(
    categoryId: number,
    page: number,
    pageSize: number
  ): Promise<LightweightPost[]>;
  getLightweightPostsBySearch(
    search: string,
    page: number,
    pageSize: number
  ): Promise<LightweightPost[]>;
  getPost(id: number): Promise<Post>;
  createPost(formData: FormData): Promise<Post>;
  deletePost(id: number): Promise<void>;
}
