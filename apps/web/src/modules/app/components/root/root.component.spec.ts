import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RootComponent } from './root.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UiModule } from './../../../../modules/ui/ui.module';
import { CookieDisclaimerComponent } from '../cookie-disclaimer/cookie-disclaimer.component';
import { SharedModule } from './../../../../modules/shared/shared.module';
import { UserService, CognitoService, StorageService, UtilityService } from './../../../../modules/shared/providers';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormModule } from './../../../../modules/form/form.module';
import { Title } from '@angular/platform-browser';
import { ApiHttpInterceptor } from '../../providers';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('RootComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormModule, HttpClientTestingModule, SharedModule, RouterTestingModule, UiModule],
        declarations: [RootComponent, FooterComponent, HeaderComponent, CookieDisclaimerComponent],
        providers: [
          {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiHttpInterceptor,
            multi: true,
          },
          UserService,
          CognitoService,
          StorageService,
          Title,
          UtilityService,
        ],
      }).compileComponents();
    })
  );

  it('should create root component', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const root = fixture.debugElement.componentInstance;
    expect(root).toBeTruthy();
  });
});
