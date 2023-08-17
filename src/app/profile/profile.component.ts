import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  faHeart,
  faImage,
  faLink,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/user';
import { IUserManager } from '../../services/abstractions/i-user-manager';
import { SERVICE_IDENTIFIERS } from '../app.module';
import { IPostRepository } from '../../services/abstractions/i-post-repository';
import { LightweightPost } from '../../models/lightweight-post';
import { ILikeRepository } from '../../services/abstractions/i-like-repository';
import { ScreenService } from '../../services/screen-service';
import { Like } from '../../models/like';
import { BehaviorSubject } from 'rxjs';
import { UserEditDto } from '../../models/dto/user-edit-dto';
import { SocialMediaLink } from 'src/models/social-media-link';
import { LinkCreateDto } from 'src/models/dto/link-create-dto';

enum MenuItem {
  photos,
  likes,
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  username: string;
  user?: User;
  posts: LightweightPost[] = [];
  page: number = 1;
  pageSize: number = 9;
  selectedMenuItem: BehaviorSubject<MenuItem> = new BehaviorSubject<MenuItem>(
    MenuItem.photos
  );
  likes?: Like[];
  numberOfPosts: number = 0;
  numberOfLikes: number = 0;
  currentUserId: string = '';
  @ViewChild('modalHelper', { static: false }) modalHelper?: ElementRef;

  constructor(
    @Inject(SERVICE_IDENTIFIERS.IUserManager)
    private readonly userManager: IUserManager,
    @Inject(SERVICE_IDENTIFIERS.IPostRepository)
    private readonly postRepository: IPostRepository,
    @Inject(SERVICE_IDENTIFIERS.ILikeRepository)
    private readonly likeRepository: ILikeRepository,
    activatedRoute: ActivatedRoute,
    private readonly screenService: ScreenService
  ) {
    this.username = activatedRoute.snapshot.paramMap.get('username')!;
  }

  async ngOnInit(): Promise<void> {
    this.user = await this.userManager.getUser(this.username);
    this.firstName = this.user.firstName;
    this.lastName = this.user.lastName;
    this.location = this.user.location;
    this.socialMediaLinks = this.user.socialMediaLinks ?? [];
    this.bio = this.user.bio;

    this.screenService.isScrollAtBottom.subscribe(async (isScrollAtBottom) => {
      if (isScrollAtBottom) {
        if (this.selectedMenuItem.value === MenuItem.photos)
          await this.loadUserPosts();
        else await this.loadLikedPosts();
      }
    });

    this.numberOfPosts = await this.postRepository.getNumberOfUserPosts(
      this.user.id
    );
    this.numberOfLikes = await this.likeRepository.getNumberOfUserLikes(
      this.user.id
    );
    [, this.currentUserId] = await Promise.all([
      this.selectPhotos(),
      this.userManager.getCurrentUserId(),
    ]);
  }

  async selectPhotos() {
    this.selectMenuItem(MenuItem.photos);
    await this.loadUserPosts();
  }

  async selectLikes() {
    this.selectMenuItem(MenuItem.likes);
    await this.loadLikedPosts();
  }

  private selectMenuItem(menuItem: MenuItem) {
    this.page = 1;
    this.posts = [];

    this.selectedMenuItem.next(menuItem);
  }

  async loadUserPosts(): Promise<void> {
    if (this.posts.length >= this.numberOfPosts) return;

    const newPosts = await this.postRepository.getLightweightUserPosts(
      this.user!.id,
      this.page,
      this.pageSize
    );
    this.posts = [...this.posts, ...newPosts];
    this.page++;
  }

  async loadLikedPosts(): Promise<void> {
    if (this.posts.length >= this.numberOfLikes) return;

    if (!this.likes)
      this.likes = await this.likeRepository.getUserLikes(this.user!.id);

    const newPosts = await this.postRepository.getLightweightLikedPosts(
      this.likes,
      this.page,
      this.pageSize
    );

    this.posts = [...this.posts, ...newPosts];
    this.page++;
  }

  protected readonly faImage = faImage;
  protected readonly faHeart = faHeart;
  protected readonly faMapMarkerAlt = faMapMarkerAlt;
  protected readonly MenuItem = MenuItem;

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.avatar = event.target.files[0];
    }
  }

  closeModal() {
    this.modalHelper!.nativeElement!.click();
  }

  firstName?: string;
  lastName?: string;
  location?: string;
  bio?: string;
  socialMediaLinks: (SocialMediaLink | LinkCreateDto)[] = [];
  linkInput: string = '';
  avatar?: File;
  async editProfile() {
    const dto = new UserEditDto(
      this.firstName,
      this.lastName,
      this.location,
      this.bio,
      this.socialMediaLinks,
      this.avatar
    );

    await this.userManager.editUserProfile(dto);
    this.closeModal();
    window.location.reload();
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === ',') this.addLink();
  }

  removeLink(link: LinkCreateDto) {
    this.socialMediaLinks = this.socialMediaLinks.filter((l) => l !== link);
  }

  async onFocusOut() {
    if (this.linkInput) this.addLink();
  }

  addLink() {
    this.socialMediaLinks.push(
      new LinkCreateDto(
        this.linkInput.replace(',', '').trim(),
        this.currentUserId
      )
    );
    this.linkInput = '';
  }

  protected readonly faLink = faLink;
}
