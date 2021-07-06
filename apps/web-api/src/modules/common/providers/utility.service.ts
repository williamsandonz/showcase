import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {

  constructor() {
  }

  urlify(input: string) {
    return input
      .replace(/_/g, '-')
      .replace(/ /g, '-')
      .replace(/-{2,}/g, '-')
      .toLowerCase();
  }

}
