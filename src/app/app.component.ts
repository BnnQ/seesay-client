import {Component, ElementRef, Inject, OnInit, ViewChild,} from '@angular/core';
import {SERVICE_IDENTIFIERS} from './app.module';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {IUserManager} from '../services/abstractions/i-user-manager';
import {ApplicationRoutes} from './app-routing.module';
import {NgxDropdownConfig} from 'ngx-select-dropdown';
import {CategoryCreateDto} from '../models/dto/category-create-dto';
import {LightweightCategory} from '../models/lightweight-category';
import {IPostRepository} from '../services/abstractions/i-post-repository';
import {INotificationService} from '../services/abstractions/i-notification-service';
import {ICategoryRepository} from '../services/abstractions/i-category-repository';
import {User} from '../models/user';
import {RedirectUtils} from 'src/utils/redirect-utils';
import {ToastrService} from 'ngx-toastr';
import {DelayHelper} from 'src/utils/delay-helper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'signal-test';
  currentUser?: User;

  constructor(
    @Inject(SERVICE_IDENTIFIERS.IUserManager)
    protected readonly userManager: IUserManager,
    @Inject(SERVICE_IDENTIFIERS.IPostRepository)
    private readonly postRepository: IPostRepository,
    @Inject(SERVICE_IDENTIFIERS.INotificationService)
    private readonly notificationService: INotificationService,
    @Inject(SERVICE_IDENTIFIERS.ICategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    private readonly toastService: ToastrService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await DelayHelper.wait(1000);

    if (this.userManager.isCurrentUserAuthenticated.value)
      this.currentUser = await this.userManager.getCurrentUser();
  }

  async logout() {
    await this.userManager.logout();
    RedirectUtils.redirectToHome();
  }

  dropdownConfig: NgxDropdownConfig = {
    clearOnSelection: false,
    customComparator(): number {
      return 0;
    },
    displayKey: 'name',
    height: 'auto',
    inputDirection: 'left-to-right',
    limitTo: 40,
    moreText: 'More',
    noResultsFound: 'No results found',
    placeholder: 'Choose...',
    search: true,
    searchOnKey: 'name',
    searchPlaceholder: 'Search',
  };
  categories: CategoryCreateDto[] = [];
  selectedCategories: LightweightCategory[] = [];
  additionalCategories: CategoryCreateDto[] = [];
  categoryInput: string = '';

  onKeyUp(event: KeyboardEvent) {
    if (event.key === ',') this.addAdditionalCategory();
  }

  removeCategory(category: CategoryCreateDto) {
    this.additionalCategories = this.additionalCategories.filter(
      (c) => c !== category
    );
  }

  async onSearch(event: string) {
    if (event)
      this.categories = await this.categoryRepository.getCategories(event, 40);
  }

  async onFocusOut() {
    if (this.categoryInput) this.addAdditionalCategory();
  }

  addAdditionalCategory() {
    this.additionalCategories.push(
      new CategoryCreateDto(this.categoryInput.replace(',', '').trim())
    );
    this.categoryInput = '';
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.image = event.target.files[0];
    }
  }

  image?: File;
  description: string = '';
  isPremium: boolean = false;
  errorMessage?: string;

  async submitPost() {
    if (!this.image) {
      this.errorMessage = 'Image is required';
      return;
    }
    if (this.categories.length < 1 && this.additionalCategories.length < 1) {
      this.errorMessage = 'Select or create at least one category for your post';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.image);
    formData.append(
      'SignalConnectionId',
      await this.notificationService.getSelfConnectionId()
    );

    let i = 0;
    for (let category of this.additionalCategories) {
      formData.append(`Categories[${i++}].Name`, category.name);
    }


    for (let category of this.selectedCategories) {
      formData.append(`Categories[${i}].Id`, category.id.toString());
      formData.append(`Categories[${i++}].Name`, category.name);
    }

    formData.append('IsPremium', this.isPremium.toString());
    if (this.description) formData.append('description', this.description);

    this.modalHelper?.nativeElement.click();
    this.toastService.info('Adding post...');
    RedirectUtils.redirectToPost((await this.postRepository.createPost(formData)).id);
  }

  searchInput: string = '';

  search() {
    if (this.searchInput) RedirectUtils.redirectToSearch(this.searchInput);
  }

  @ViewChild('modalHelper', {static: false}) modalHelper?: ElementRef;
  protected readonly faSearch = faSearch;
  protected readonly ApplicationRoutes = ApplicationRoutes;
}
