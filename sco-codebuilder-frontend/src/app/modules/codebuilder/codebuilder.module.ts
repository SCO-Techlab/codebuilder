import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { CodebuilderComponent } from './component/codebuilder.component';
import { CodebuilderService } from './codebuilder.service';
import { CodebuilderState } from './store/codebuilder.state';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsModule.forFeature(
      [
        CodebuilderState
      ]
    ),
    SharedModule,

    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    CodebuilderComponent,
  ],
  exports: [
    CodebuilderComponent,
  ],
  providers: [
    CodebuilderService
  ],
})
export class CodebuilderModule { }
