import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from 'src/app/shared/cache/cache.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { TranslateService } from 'src/app/shared/translate/translate.service';

@Component({
  template: ''
})
export class CodebuilderExampleComponent implements OnInit {

  constructor(
    private readonly translateService: TranslateService,
    private readonly cacheService: CacheService,
    private readonly spinnerService: SpinnerService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.spinnerService.showSpinner();

    const htmlExampleCode: string = `
<button class="btn btn-primary" onclick="onSayHello()">
  ${this.translateService.getTranslate('label.codebuilder-example.component.example.html.button')}
</button>
    `;
    
    const cssExampleCode: string = `
body {
  padding: 25px;
}

.btn {
  font-size: 50px !important;
}
    `;
    
    const jssExampleCode: string = `
for (let i = 1; i <= 10; i++) {
  console.log('Table of: ' + i);
  
  for (let j = 1; j <= 10; j++) {
    console.log(i + ' * ' + j + ' = ' + (i*j));
  }

  console.log('\\n');
}

function onSayHello() {
  console.log('Hello World!');
}
    `;

    this.cacheService.setElement('codebuilder-example', true);
    this.cacheService.setElement('codebuilder-example-html', htmlExampleCode);
    this.cacheService.setElement('codebuilder-example-css', cssExampleCode);
    this.cacheService.setElement('codebuilder-example-js', jssExampleCode);

    this.router.navigateByUrl('codebuilder');
  }

}
