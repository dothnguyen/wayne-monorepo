import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'wayne-monorepo-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  loading = false;

  profileForm: FormGroup;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {
    this.profileForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      avatarUrl: new FormControl('', [
        Validators.pattern(
          '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
        ),
      ]),
    });
  }

  ngOnInit() {}
}
