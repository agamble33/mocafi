import { Component, AfterViewInit, ViewChild, inject } from "@angular/core";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { User } from "../../user";
import { UserService } from "../../admin.service";
import { delay } from "rxjs";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UpsertUserComponent } from "../upsert-user/upsert-user.component";

@Component({
  selector: "app-user-list",
  standalone: true,
  providers: [UserService],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatProgressBarModule, TitleCasePipe, MatDialogModule],
  templateUrl: "./user-list.component.html",
  styleUrl: "./user-list.component.scss",
})
export class UserListComponent implements AfterViewInit {
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly snackabar = inject(MatSnackBar);
  length = 2988;
  pageIndex = 0;
  pageSize = 25;
  displayedColumns: string[] = ["name", "email", "gender", "status", "actions"];
  dataSource = new MatTableDataSource<User>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.getData();
  }

  getData(event?: PageEvent) {
    this.loading = true;
    if (event) {
      const { pageIndex, pageSize } = event;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
    }
    this.userService
      .getUsers(this.pageIndex + 1, this.pageSize)
      .pipe(delay(1000))
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
        this.loading = false;
        // this.dataSource.paginator = this.paginator;
      });
  }

  handleAddClick() {
    const dialogRef = this.dialog.open(UpsertUserComponent, { data: {} });

    dialogRef.afterClosed().subscribe((newUser) => {
      if (newUser.type === "create") {
        // insert at first row on page
        this.dataSource.data.unshift({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          gender: newUser.gender,
          status: newUser.status,
        });
        this.length++;
        this.dataSource = new MatTableDataSource(this.dataSource.data);

        this.snackabar.open(`Successfully added ${newUser.name} to users`, "", {
          duration: 4000,
          politeness: "assertive",
          verticalPosition: "top",
        });
      }
    });
  }

  handleEditClick(user: User) {
    const dialogRef = this.dialog.open(UpsertUserComponent, {
      data: user,
    });
    dialogRef.afterClosed().subscribe((newUser: { type: "create" | "update" } & User) => {
      if (!newUser) return;

      if (newUser.type === "update") {
        const userIndex = this.dataSource.data.findIndex((u) => u.id == user.id);

        console.log(newUser);
        this.dataSource.data[userIndex] = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          gender: newUser.gender,
          status: newUser.status,
        };
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.snackabar.open(`Successfully updated ${newUser.name}`, "", {
          duration: 4000,
          politeness: "assertive",
          verticalPosition: "top",
        });
      }
    });
  }

  handleDeleteClick(user: User) {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    this.userService.deleteUser(user.id).subscribe(() => {
      const userIndex = this.dataSource.data.findIndex((u) => u.id == user.id);
      this.dataSource.data.splice(userIndex, 1);
      this.length--;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.snackabar.open(`Deleted ${user.name}`, "", {
        duration: 4000,
        politeness: "assertive",
        verticalPosition: "top",
      });
    });
  }
}
