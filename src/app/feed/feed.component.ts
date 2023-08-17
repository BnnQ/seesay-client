import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { LightweightPost } from '../../models/lightweight-post';
import { Like } from '../../models/like';
import { BehaviorSubject } from 'rxjs';
import { SERVICE_IDENTIFIERS } from '../app.module';
import { ILikeRepository } from '../../services/abstractions/i-like-repository';
import { IUserManager } from '../../services/abstractions/i-user-manager';
import {
  faCheck,
  faComment,
  faDownload,
  faHeart as faSolidHeart,
  faShare,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { Post } from '../../models/post';
import { IPostRepository } from '../../services/abstractions/i-post-repository';
import { Router } from '@angular/router';
import { ApplicationRoutes } from '../app-routing.module';
import { DelayHelper } from '../../utils/delay-helper';
import { ScreenService, ScreenSize } from '../../services/screen-service';
import Editor from '../../services/editor';
import { ICommentRepository } from '../../services/abstractions/i-comment-repository';
import { CommentCreateDto } from '../../models/dto/comment-create-dto';
import { FileService } from '../../services/file-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['feed.component.scss', '../../stylesheets/hoverable.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedComponent implements OnInit, AfterViewInit {
  @Input() posts: LightweightPost[] | null | undefined = null;
  @Input() selectedPostId: number | null | undefined = null;
  isCurrentUserLiked: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  isCurrentUserHasPremium: Promise<boolean> = Promise.resolve(false);
  selectedPost?: Post;
  isShared: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @ViewChild('modalHelper', { static: false }) modalHelper?: ElementRef;
  editorContent: string = '';

  constructor(
    @Inject(SERVICE_IDENTIFIERS.ILikeRepository)
    private readonly likeRepository: ILikeRepository,
    @Inject(SERVICE_IDENTIFIERS.IUserManager)
    private readonly userManager: IUserManager,
    @Inject(SERVICE_IDENTIFIERS.IPostRepository)
    private readonly postRepository: IPostRepository,
    private readonly router: Router,
    protected readonly screenInfoService: ScreenService,
    @Inject(SERVICE_IDENTIFIERS.ICommentRepository)
    private readonly commentRepository: ICommentRepository,
    private readonly fileService: FileService,
    private cdr: ChangeDetectorRef
  ) {
    this.isCurrentUserHasPremium =  this.userManager.isCurrentUserHasPremium();
  }

  async ngOnInit(): Promise<void> {
    if (this.selectedPostId) await this.selectPost(this.selectedPostId);
  }

  async selectPost(postId: number) {
    this.selectedPost = await this.postRepository.getPost(postId);
    if (this.userManager.isCurrentUserAuthenticated.value) {
      const currentUserId = await this.userManager.getCurrentUserId();
      this.isCurrentUserLiked.next(
        await this.likeRepository.getUserLike(currentUserId, postId)
      );
    }
  }

  async clickShare() {
    await navigator.clipboard.writeText(
      `${window.location.origin}/posts/${this.selectedPost!.id}`
    );
    this.isShared.next(true);

    await DelayHelper.wait(5000);
    this.isShared.next(false);
  }

  serverApiUrl: string = environment.serverApiUrl;
  async clickDownload() {
    if (this.selectedPost) {
      await this.fileService.downloadFile(
        `${this.serverApiUrl}Post/DownloadPost`,
        'image/jpg',
        this.selectedPost.description + '.jpg',
        { id: this.selectedPost.id }
      );
    }
  }

  async clickLike() {
    if (!this.userManager.isCurrentUserAuthenticated.value) {
      this.closeModal();
      await this.router.navigate([ApplicationRoutes.login]);
    }

    const currentUserId = await this.userManager.getCurrentUserId();
    const postId = this.selectedPost!.id;
    const isLiked = await this.likeRepository.getUserLike(
      currentUserId,
      postId
    );

    if (isLiked) {
      await this.likeRepository.deleteLike(currentUserId, postId);
      this.isCurrentUserLiked.next(false);
    } else {
      await this.likeRepository.addLike(new Like(0, currentUserId, postId));
      this.isCurrentUserLiked.next(true);
    }
  }

  protected readonly faSolidHeart = faSolidHeart;
  protected readonly faRegularHeart = faRegularHeart;
  protected readonly faDownload = faDownload;
  protected readonly faShare = faShare;
  protected readonly faCheck = faCheck;
  protected readonly ApplicationRoutes = ApplicationRoutes;

  async ngAfterViewInit(): Promise<void> {
    if (this.selectedPostId) {
      //Ensure modal helper loaded
      while (!this.modalHelper) await DelayHelper.wait(200);

      this.modalHelper.nativeElement.click();
    }
  }

  closeModal() {
    this.modalHelper!.nativeElement!.click();
  }

  async addComment() {
    if (!this.userManager.isCurrentUserAuthenticated.value) {
      this.closeModal();
      await this.router.navigate([ApplicationRoutes.login]);
      return;
    }

    const currentUserId = await this.userManager.getCurrentUserId();
    const comment = await this.commentRepository.addComment(
      new CommentCreateDto(
        this.editorContent,
        currentUserId,
        this.selectedPost!.id
      )
    );
    this.editorContent = '';
    this.selectedPost!.comments!.push(comment);
    this.cdr.detectChanges();
  }

  protected readonly ScreenSize = ScreenSize;
  protected readonly faComment = faComment;
  protected readonly faCalendar = faCalendar;
  public Editor = Editor;
}
