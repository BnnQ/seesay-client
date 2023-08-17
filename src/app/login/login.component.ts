import { Component, Inject } from '@angular/core';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { ApplicationRoutes } from '../app-routing.module';
import { SERVICE_IDENTIFIERS } from '../app.module';
import { IUserManager } from '../../services/abstractions/i-user-manager';
import { UserLoginDto } from '../../models/dto/user-login-dto';
import { Router } from '@angular/router';
import { RedirectUtils } from 'src/utils/redirect-utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../stylesheets/account.scss', './login.component.scss'],
})
export class LoginComponent {
  username?: string;
  password?: string;
  constructor(
    @Inject(SERVICE_IDENTIFIERS.IUserManager)
    private readonly userManager: IUserManager,
    private readonly toastService: ToastrService
  ) {}

  async externalLogin(provider: string) {
    await this.userManager
      .externalLogin(provider)
      .then((_) => RedirectUtils.redirectToHome());
  }

  errorMessage? : string;
  async submitLogin() {
    if (!this.username) {
      this.errorMessage = 'Username is required';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password is required';
      return;
    }

    try {
      await this.userManager.login(
        new UserLoginDto(this.username!, this.password!)
      );
      RedirectUtils.redirectToHome();
    } catch (error: any) {
      this.toastService.error(error.response.data);
    }
  }

  protected readonly faUserPlus = faUserPlus;
  protected readonly faGoogle = faGoogle;
  protected readonly faGithub = faGithub;
  protected readonly ApplicationRoutes = ApplicationRoutes;
}
