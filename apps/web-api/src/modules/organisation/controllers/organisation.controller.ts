import { Controller } from '@nestjs/common';
import { OrganisationService } from './../providers';

@Controller('organisation')
export class OrganisationController {
  constructor(private service: OrganisationService) {}
}
