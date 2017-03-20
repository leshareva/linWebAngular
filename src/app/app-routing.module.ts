import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TasksComponent} from "./tasks/tasks.component";
import {IndexComponent} from "./index/index.component";
import {SelectComponent} from "./environment/select/select.component";
import {NewUserComponent} from "./index/new-user/new-user.component";
import {EnvironmentComponent} from "./environment/environment.component";
import {LoginComponent} from "./login/login.component";
import {NewFileComponent} from "./new-file/new-file.component";
import {InstructionsComponent} from "./instructions/instructions.component";

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TasksComponent},
  { path: '', component: IndexComponent },
  { path: 'select', component: EnvironmentComponent },
  { path: 'new-user', component: NewUserComponent },
  { path: 'how-work', component: InstructionsComponent },
  { path: 'upload-file', component: NewFileComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes, { useHash: true }) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {

}
