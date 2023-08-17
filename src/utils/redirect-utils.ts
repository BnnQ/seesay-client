import { ApplicationRoutes } from 'src/app/app-routing.module';

export class RedirectUtils {
  private static baseUrl =
    window.location.protocol + '//' + window.location.host;

  static redirectToHome() {
    window.location.replace(this.baseUrl);
  }

  static redirectToSearch(search: string) {
    window.location.replace(
      this.baseUrl + ApplicationRoutes.search + '?q=' + search
    );
  }

  static redirectToPost(postId: number) {
    window.location.replace(
      this.baseUrl + ApplicationRoutes.post + '/' + postId
    );
  }
}
