import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { candidateInterceptor } from './interceptors/candidate.interceptor';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule, provideSpinnerConfig } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([candidateInterceptor])),
    provideAnimations(),
    provideToastr(),
    provideSpinnerConfig({
      type: 'line-spin-clockwise-fade',
    }),
  ],
};
