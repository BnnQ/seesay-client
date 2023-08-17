import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: 'formatted'})
export class FormattedNumberPipe implements PipeTransform {
  private static readonly formatter = Intl.NumberFormat('en', {notation: 'compact'});

  transform(value: any): any {
    if (typeof value !== 'number')
      throw new SyntaxError('Unsupported argument type. "formatted" pipe accepts only numbers.');

    return FormattedNumberPipe.formatter.format(value).toLowerCase();
  }
}
