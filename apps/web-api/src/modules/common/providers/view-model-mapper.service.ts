import { Injectable } from '@nestjs/common';
import { Account } from '../../account/entities';
import { Organisation } from '../../organisation/entities';

@Injectable()
export class ViewModelMapperService {

  constructor() {
  }

  mapAccount(account: Account) {

  }

  mapOrganisation(organisation: Organisation) {

  }

}
