import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodebuilderExampleComponent } from './codebuilder-example.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CodebuilderExampleComponent,
  ],
  exports: [
    CodebuilderExampleComponent,
  ]
})
export class CodebuilderExampleModule { }
