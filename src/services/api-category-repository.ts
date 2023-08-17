import { ICategoryRepository } from './abstractions/i-category-repository';
import { Category } from '../models/category';
import { LightweightCategory } from '../models/lightweight-category';
import { environment } from '../environments/environment';
import { Inject, Injectable } from '@angular/core';
import { SERVICE_IDENTIFIERS } from '../app/app.module';
import IHttpService from './abstractions/i-http-service';

@Injectable({ providedIn: 'root' })
export class ApiCategoryRepository implements ICategoryRepository {
  private readonly serverApiUrl: string = environment.serverApiUrl;
  constructor(
    @Inject(SERVICE_IDENTIFIERS.IHttpService)
    private readonly httpService: IHttpService
  ) {}

  addCategory(entity: Category): Promise<void> {
    return this.httpService.post(
      new URL(`${this.serverApiUrl}Category/AddCategory`),
      { name: entity.name }
    );
  }

  deleteCategory(id: number): Promise<void> {
    return this.httpService.delete(
      new URL(`${this.serverApiUrl}Category/DeleteCategory`),
      { id: id }
    );
  }

  getCategory(id: number): Promise<Category> {
    return this.httpService.get(
      new URL(`${this.serverApiUrl}Category/GetCategory`),
      { id: id }
    );
  }

  getCategories(
    search: string,
    limit: number = 40
  ): Promise<LightweightCategory[]> {
    return this.httpService.get(
      new URL(`${this.serverApiUrl}Category/GetCategories`),
      { search: search },
      { limit: limit }
    );
  }

  getMostPopularLightweightCategories(
    limit: number
  ): Promise<LightweightCategory> {
    return this.httpService.get(
      new URL(`${this.serverApiUrl}Category/GetMostPopularCategories`),
      undefined,
      { limit: limit }
    );
  }
}
