import { Pipe, PipeTransform } from '@angular/core';
import { getUserFullName } from '../_misc/chamber';
import { IUser } from '../interfaces/user.interface';

@Pipe({
  name: 'userFullName'
})
export class UserFullNamePipe implements PipeTransform {
  transform(value: any, user: IUser): string {
    const nameFormatted: string = getUserFullName(user);
    return nameFormatted;
  }
}
