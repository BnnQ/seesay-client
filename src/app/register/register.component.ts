import { Component, Inject } from '@angular/core';
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { ApplicationRoutes } from '../app-routing.module';
import { SERVICE_IDENTIFIERS } from '../app.module';
import { IUserManager } from '../../services/abstractions/i-user-manager';
import { UserRegisterDto } from '../../models/dto/user-register-dto';
import { ToastrService } from 'ngx-toastr';
import { RedirectUtils } from 'src/utils/redirect-utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../stylesheets/account.scss', './register.component.scss'],
})
export class RegisterComponent {
  firstName?: string = undefined;
  lastName?: string = undefined;
  email?: string = undefined;
  username?: string;
  password?: string;
  confirmPassword?: string;

  constructor(
    @Inject(SERVICE_IDENTIFIERS.IUserManager)
    protected readonly userManager: IUserManager,
    private readonly toastService: ToastrService
  ) {}

  errorMessage?: string;
  async register() {
    if (!this.firstName) {
      this.errorMessage = 'First name is required.';
      return;
    }
    if (!this.lastName) {
      this.errorMessage = 'Last name is required';
      return;
    }
    if (!this.email) {
      this.errorMessage = 'Email is required';
      return;
    }
    if (!this.username) {
      this.errorMessage = 'Username is required';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Password is required';
      return;
    }
    if (!this.confirmPassword) {
      this.errorMessage = 'Confirm password is required';
      return;
    }

    try {
      await this.userManager.register(
        new UserRegisterDto(
          this.firstName,
          this.lastName,
          this.email,
          this.username,
          this.password,
          this.confirmPassword
        )
      );
      RedirectUtils.redirectToHome();
    } catch (error: any) {
      this.toastService.error(JSON.stringify(error.response.data));
    }
  }

  protected readonly faGoogle = faGoogle;
  protected readonly faGithub = faGithub;
  protected readonly ApplicationRoutes = ApplicationRoutes;
}
