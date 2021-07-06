import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IOrganisationInvitationVm } from '@monorepo/web-api-client';
import { InviteOrganisationMemberComponent } from '../invite-organisation-member/invite-organisation-member.component';
import { OrganisationInvitationsComponent } from '../organisation-invitations/organisation-invitations.component';

@Component({
  selector: 'app-organisation-settings-members',
  templateUrl: './organisation-settings-members.component.html',
  styleUrls: ['./organisation-settings-members.component.scss'],
})
export class OrganisationSettingsMembersComponent implements OnInit {

  @ViewChild(OrganisationInvitationsComponent) invitationsComponent: OrganisationInvitationsComponent;

  constructor(
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
  }

  openInviteMemberDialog($event: MouseEvent) {
    $event.preventDefault();
    const dialogRef = this.dialog.open(InviteOrganisationMemberComponent);
    dialogRef.afterClosed().subscribe((invitation: IOrganisationInvitationVm) => {
      if(invitation) {
        this.invitationsComponent.onInviteSent(invitation);
      }
    });
  }

}
