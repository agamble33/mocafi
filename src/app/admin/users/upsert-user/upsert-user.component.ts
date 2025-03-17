import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../user';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../admin.service';

@Component({
  selector: 'app-user-create',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  standalone: true,
  templateUrl: './upsert-user.component.html',
  styleUrl: './upsert-user.component.scss',
})
export class UpsertUserComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<{ type: 'create' | 'update' } & User>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService
  ) {}

  public title = 'Create New User';
  public userId: number | null = null;
  public isLoading: boolean = false;

  userFormGroup = new FormGroup<UserForm>({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(45),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    status: new FormControl('active', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if (this.data?.id) {
      this.title = 'Update user';
    }
    this.userId = this.data.id;
    this.nameControl.setValue(this.data.name);
    this.emailControl.setValue(this.data.email);
    this.genderControl.setValue(this.data.gender);
    this.statusControl.setValue(this.data.status);
  }

  get nameControl() {
    return this.userFormGroup.controls.name;
  }

  get emailControl() {
    return this.userFormGroup.controls.email;
  }

  get statusControl() {
    return this.userFormGroup.controls.status;
  }

  get genderControl() {
    return this.userFormGroup.controls.gender;
  }

  handleFormSubmit() {
    if (!this.userFormGroup.valid) return;
    const isUpdate = !!this.data.id;
    this.isLoading = true;

    if (!isUpdate) {
      this.userService
        .createUser({ ...(this.userFormGroup.value as User) })
        .subscribe((res) => {
          this.isLoading = false;
          this.dialogRef.close({
            type: 'create',
            ...res,
          });
        });
    }

    if (isUpdate) {
      this.userService
        .updateUser({ ...(this.userFormGroup.value as User), id: this.data.id })
        .subscribe(() => {
          this.isLoading = false;
          this.dialogRef.close({
            type: 'update',
            ...this.userFormGroup.value,
          });
        });
    }
  }

  handleModalClose() {
    this.dialogRef.close();
  }
}

export type UserForm =
  | {
      [field in keyof Omit<User, 'id'>]: FormControl<User[field] | null>;
    }
  | { [field in keyof User]: FormControl<User[field] | null> };
