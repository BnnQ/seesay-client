export class DelayHelper {
  public static wait(milliseconds : number) : Promise<void> {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}
