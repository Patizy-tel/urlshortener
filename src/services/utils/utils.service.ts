import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UtilsService {
  triggerUpdate = new BehaviorSubject<boolean>(false);
  characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

  constructor() {}

  generateRandomId(length: number): string {
    let url = '';
    const charactersLength = this.characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      url += this.characters.charAt(randomIndex);
    }

    return url;
  }
}
