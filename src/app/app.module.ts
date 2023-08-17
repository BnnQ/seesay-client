import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { INotificationService } from '../services/abstractions/i-notification-service';
import IHttpService from '../services/abstractions/i-http-service';
import { SignalNotificationService } from '../services/signal-notification-service';
import { AxiosHttpService } from '../services/axios-http-service';
import { FeedComponent } from './feed/feed.component';
import { NgOptimizedImage } from '@angular/common';
import { IPostRepository } from '../services/abstractions/i-post-repository';
import { ApiPostRepository } from '../services/api-post-repository';
import { ICategoryRepository } from '../services/abstractions/i-category-repository';
import { ICommentRepository } from '../services/abstractions/i-comment-repository';
import { ILikeRepository } from '../services/abstractions/i-like-repository';
import { ApiCategoryRepository } from '../services/api-category-repository';
import { ApiCommentRepository } from '../services/api-comment-repository';
import { ApiLikeRepository } from '../services/api-like-repository';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IUserManager } from '../services/abstractions/i-user-manager';
import { ApiUserManager } from '../services/api-user-manager';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { ScreenService } from '../services/screen-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { FormattedNumberPipe } from '../pipes/FormattedNumberPipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SearchComponent } from './search/search.component';
import { CategoryComponent } from './category/category.component';
import { FileService } from '../services/file-service';
import { TimeAgoPipe } from 'src/pipes/TimeAgoPipe';
import { PremiumComponent } from './premium/premium.component';
import { BillingComponent } from './billing/billing.component';

export const SERVICE_IDENTIFIERS = {
  IHttpService: new InjectionToken<IHttpService>('IHttpService'),
  INotificationService: new InjectionToken<INotificationService>(
    'INotificationService'
  ),
  IPostRepository: new InjectionToken<IPostRepository>('IPostRepository'),
  ICategoryRepository: new InjectionToken<ICategoryRepository>(
    'ICategoryRepository'
  ),
  ICommentRepository: new InjectionToken<ICommentRepository>(
    'ICommentRepository'
  ),
  ILikeRepository: new InjectionToken<ILikeRepository>('ILikeRepository'),
  IUserManager: new InjectionToken<IUserManager>('IUserManager'),
};

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    FormattedNumberPipe,
    TimeAgoPipe,
    SearchComponent,
    CategoryComponent,
    PremiumComponent,
    BillingComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgOptimizedImage,
    AppRoutingModule,
    FontAwesomeModule,
    ContentLoaderModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SelectDropDownModule,
    CKEditorModule,
  ],
  providers: [
    {
      provide: SERVICE_IDENTIFIERS.IHttpService,
      useClass: AxiosHttpService,
    },
    {
      provide: SERVICE_IDENTIFIERS.INotificationService,
      useClass: SignalNotificationService,
    },
    {
      provide: SERVICE_IDENTIFIERS.IPostRepository,
      useClass: ApiPostRepository,
    },
    {
      provide: SERVICE_IDENTIFIERS.ICategoryRepository,
      useClass: ApiCategoryRepository,
    },
    {
      provide: SERVICE_IDENTIFIERS.ICommentRepository,
      useClass: ApiCommentRepository,
    },
    {
      provide: SERVICE_IDENTIFIERS.ILikeRepository,
      useClass: ApiLikeRepository,
    },
    {
      provide: SERVICE_IDENTIFIERS.IUserManager,
      useClass: ApiUserManager,
    },
    ScreenService,
    FileService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
