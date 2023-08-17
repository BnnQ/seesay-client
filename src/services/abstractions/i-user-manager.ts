import { UserRegisterDto } from '../../models/dto/user-register-dto';
import { UserLoginDto } from '../../models/dto/user-login-dto';
import { Role } from '../../models/role';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user';
import { UserEditDto } from '../../models/dto/user-edit-dto';
import { PaymentInfo } from 'src/models/payment-info';

export interface IUserManager {
  isCurrentUserAuthenticated: BehaviorSubject<boolean>;

  register(registerDto: UserRegisterDto): Promise<string | void>;
  login(loginDto: UserLoginDto): Promise<string | void>;
  externalLogin(provider: string): Promise<string | void>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User>;
  getCurrentUserId(): Promise<string>;
  getCurrentUserRoles(): Promise<Role[]>;
  getUserById(id: string): Promise<User>;
  getUser(username: string): Promise<User>;
  isCurrentUserHasPremium(): Promise<boolean>;
  editUserProfile(userEditDto: UserEditDto): Promise<void>;
  buyPremium(paymentInfo: PaymentInfo): Promise<void>;
}
