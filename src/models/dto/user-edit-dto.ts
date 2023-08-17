import { SocialMediaLink } from '../social-media-link';
import { LinkCreateDto } from './link-create-dto';

export class UserEditDto {
  constructor(
    public firstName?: string,
    public lastName?: string,
    public location?: string,
    public bio?: string,
    public socialMediaLinks?: (SocialMediaLink | LinkCreateDto)[],
    public avatar?: File
  ) {}
}
