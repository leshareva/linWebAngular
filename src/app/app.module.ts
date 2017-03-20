import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import {AngularFireModule, AuthProviders, AuthMethods} from 'angularfire2';

import { AppComponent } from './app.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { NavComponent } from './nav/nav.component';
import { TasksComponent } from './tasks/tasks.component';

import { AuthService } from './auth.service';
import { UserService } from './services/user.service'
import {TaskService} from "./services/task.service";
import { ChatComponent } from './tasks/task-detail/chat/chat.component';
import { StepsComponent } from './tasks/task-detail/steps/steps.component';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { PriceComponent } from './tasks/task-detail/price/price.component';

import { AppRoutingModule }     from './app-routing.module';
import { SourcesComponent } from './tasks/task-detail/sources/sources.component';
import { UploadConceptComponent } from './tasks/task-detail/upload-concept/upload-concept.component';
import { IndexComponent } from './index/index.component';

import { SelectComponent } from './environment/select/select.component';
import { EnvironmentComponent } from './environment/environment.component';
import { NewUserComponent } from './index/new-user/new-user.component';
import { LoginComponent } from './login/login.component';
import {Constants} from "./constants";
import {EnvironmentService} from "./services/environment.service";
import {EqualValidator} from "./index/new-user/equal-validator.directive";
import {firebaseConfig} from "../environments/firebase.config";

import { TipsComponent } from './environment/tips/tips.component';
import { AccordionModule } from 'ngx-accordion';
import { NewFileComponent } from './new-file/new-file.component'
import { InstructionsComponent } from './instructions/instructions.component'

import {SliderModule} from 'primeng/primeng';
import { ImageUploadModule } from 'ng2-imageupload';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { TinyComponent } from './tiny/tiny.component';
import { AwarenessComponent } from './tasks/task-detail/awareness/awareness.component';

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TaskDetailComponent,
    NavComponent,
    TasksComponent,
    ChatComponent,
    StepsComponent,
    FileSelectDirective,
    FileDropDirective,
    PriceComponent,
    SourcesComponent,
    AwarenessComponent,
    UploadConceptComponent,
    IndexComponent,
    SelectComponent,
    EnvironmentComponent,
    NewUserComponent,
    LoginComponent,
    EqualValidator,
    TipsComponent,
    NewFileComponent,
    InstructionsComponent,
    TinyComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AccordionModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    SliderModule,
    ImageUploadModule,
    Ng2ImgMaxModule
  ],
  providers: [ TaskService, AuthService, UserService, EnvironmentService, Constants ],
  bootstrap: [AppComponent]
})


export class AppModule { }
