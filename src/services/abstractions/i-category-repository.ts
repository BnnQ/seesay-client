import {LightweightCategory} from "../../models/lightweight-category";
import {Category} from "../../models/category";

export interface ICategoryRepository {
  getMostPopularLightweightCategories(limit : number) : Promise<LightweightCategory>;
  getCategory(id : number) : Promise<Category>;
  getCategories(search : string, limit : number) : Promise<LightweightCategory[]>;
  addCategory(entity : Category) : Promise<void>;
  deleteCategory(id : number) : Promise<void>;
}
