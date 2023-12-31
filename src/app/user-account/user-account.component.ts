import { Component } from '@angular/core';
import { MaterialModule } from '../shared/modules/material.module';
import { CommonModule } from '@angular/common';
import { UserApi } from '../shared/api/user.api';
import { WalletBalanceModalComponent } from './wallet-balance-modal/wallet-balance-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UserFormModalComponent } from '../users/user-form-modal/user-form-modal.component';
import { Router } from '@angular/router';
import { KeycloakService } from '../shared/keycloak/services/keycloak.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule]
})
export class UserAccountComponent {

  userId: string | undefined
  user$ = this.userApi.getUserinfoAsUser()
  userActivated: boolean = true

  constructor(public dialog: MatDialog, private readonly keycloakService: KeycloakService, private readonly userApi: UserApi, private readonly router: Router) {
      this.userApi.checkIfMongoExist().subscribe(resp => {
        if(!resp) {
          this.userActivated = false
        }
      })
      this.userId = this.keycloakService.getUserId()
    }

  openDialog() {
    const dialogRef = this.dialog.open(WalletBalanceModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {        
        this.userApi.addMoneyToWallerasUser(result).subscribe({
          next: () => this.user$ = this.userApi.getUserinfoAsUser()
        })
      }
    })
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(UserFormModalComponent, {
      data: {
        mode: 'userInit'
      }
    })

    dialogRef.afterClosed().subscribe(resp => {
      if(resp) {
        const resp_with_userId = {
          ...resp,
          _id: this.userId
        }
        this.userApi.addUser(resp_with_userId).subscribe({
          next: () => this.router.navigate(['/home'])
        })
      }
    })
  }
}
