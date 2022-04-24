import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ModernCommonModule } from './app/app.module';
import { environment } from './environments/environment';

import 'flowbite';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(ModernCommonModule)
  .catch(err => console.error(err));
