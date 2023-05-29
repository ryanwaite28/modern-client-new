import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { finalize, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'modern-verify-password-reset-page',
  templateUrl: './verify-password-reset-page.component.html',
  styleUrls: ['./verify-password-reset-page.component.scss']
})
export class VerifyPasswordResetPageComponent implements OnInit {

  loading = false;
  message = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
    .pipe(tap(() => { this.loading = true }))
    .pipe(
      mergeMap((params: Params) => {
        if (!params['verification_code']) {
          const message = 'No verification code detected.';
          this.message = message;
          this.loading = false;
          throw new Error(message);
        }
        return this.usersService.submit_password_reset_code(params['verification_code'])
      })
    )
    .subscribe({
      next: (response) => {
        this.message = response.message!;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.message = error.error.message;
        this.loading = false;
      }
    });
  }

}
