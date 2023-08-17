import {IUserManager} from './abstractions/i-user-manager';
import {Role} from '../models/role';
import {UserLoginDto} from '../models/dto/user-login-dto';
import {UserRegisterDto} from '../models/dto/user-register-dto';
import {environment} from '../environments/environment';
import {Inject, Injectable} from '@angular/core';
import {SERVICE_IDENTIFIERS} from '../app/app.module';
import IHttpService from './abstractions/i-http-service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../models/user';
import {UserEditDto} from '../models/dto/user-edit-dto';
import {PaymentInfo} from 'src/models/payment-info';
import {DelayHelper} from "../utils/delay-helper";

@Injectable({ providedIn: 'root' })
export class ApiUserManager implements IUserManager {
  private readonly serverApiUrl: string = environment.serverApiUrl;
  public isCurrentUserAuthenticated: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private initialized : boolean = false;
  constructor(
    @Inject(SERVICE_IDENTIFIERS.IHttpService)
    private readonly httpService: IHttpService
  ) {
    this.getIsCurrentUserAuthenticated().then((isCurrentUserAuthenticated) =>
    { this.setIsAuthenticated(isCurrentUserAuthenticated); this.initialized = true;}
    );
  }

  public setIsAuthenticated(isAuthenticated: boolean): void {
    this.isCurrentUserAuthenticated!.next(isAuthenticated);
  }

  getUser(username: string): Promise<User> {
    return this.httpService.get(
      new URL(`${this.serverApiUrl}Account/GetUser`),
      { username: username }
    );
  }
  async externalLogin(provider: string): Promise<string | void> {
    window.open(
      `${this.serverApiUrl}Account/ExternalLogin?provider=${provider}`,
      'mywindow',
      'location=1,status=1,scrollbars=1, width=800, height=800, left=100, top=400'
    );
    await new Promise<void>((resolve) => {
      window.addEventListener('message', async (event) => {
        if (event.data === 'authentication_successful') {
          this.setIsAuthenticated(true);
          resolve();
        }
      });
    });
  }

  async getCurrentUser(): Promise<User> {
    const currentUserId = await this.getCurrentUserId();
    return await this.getUserById(currentUserId);
  }

  async getCurrentUserId(): Promise<string> {
    return (
      (await this.httpService.get(
        new URL(`${this.serverApiUrl}Account/GetCurrentUserId`)
      )) as {
        currentUserId: string;
      }
    ).currentUserId;
  }

  getCurrentUserRoles(): Promise<Role[]> {
    return this.httpService.get(
      new URL(`${this.serverApiUrl}Account/GetCurrentUserRoles`)
    );
  }

  private async getIsCurrentUserAuthenticated(): Promise<boolean> {
    const response = await this.httpService.get(
      new URL(`${this.serverApiUrl}Account/IsAuthenticated`)
    );
    return (response as { isAuthenticated: boolean }).isAuthenticated;
  }

  getUserById(id: string): Promise<User> {
    return this.httpService.get(
      new URL(`${this.serverApiUrl}Account/GetUserById`),
      { id: id }
    );
  }

  async isCurrentUserHasPremium(): Promise<boolean> {
    while (!this.initialized)
    await DelayHelper.wait(200);
    if (!this.isCurrentUserAuthenticated.value)
        return false;

    const currentUser = await this.getCurrentUser();
    return currentUser.hasPremium;
  }

  async login(loginDto: UserLoginDto): Promise<string | void> {
    try {
      await this.httpService.post(
        new URL(`${this.serverApiUrl}Account/Login`),
        loginDto
      );

      this.setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  }

  async register(registerDto: UserRegisterDto): Promise<string | void> {
    try {
      await this.httpService.post(
        new URL(`${this.serverApiUrl}Account/Register`),
        registerDto
      );
      this.setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.httpService.get(new URL(`${this.serverApiUrl}Account/Logout`));
    this.setIsAuthenticated(false);
  }

  async editUserProfile(userEditDto: UserEditDto): Promise<void> {
    const body: any = {
      firstName: userEditDto.firstName,
      lastName: userEditDto.lastName,
      location: userEditDto.location,
      bio: userEditDto.bio,
      avatar: userEditDto.avatar,
    };

    if (userEditDto.socialMediaLinks) {
      for (let i = 0; i < userEditDto.socialMediaLinks.length; i++) {
        const link = userEditDto.socialMediaLinks[i];
        body[`SocialMediaLinks[${i}].Link`] = link.link;
        body[`SocialMediaLinks[${i}].UserId`] = link.userId;

        if ('id' in link) {
          body[`SocialMediaLinks[${i}].Id`] = link.id;
        }
      }
    }

    await this.httpService
      .post(
        new URL(`${this.serverApiUrl}Account/EditUserProfile`),
        body,
        { id: await this.getCurrentUserId() },
        undefined,
        { 'Content-Type': 'multipart/form-data' }
      );
  }

  buyPremium(paymentInfo: PaymentInfo): Promise<void> {
    return this.httpService.post(
      new URL(`${this.serverApiUrl}Account/BuyPremium`),
      paymentInfo
    );
  }
}
