import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistrationListPage } from './registration-list.page';

describe('RegistrationListPage', () => {
  let component: RegistrationListPage;
  let fixture: ComponentFixture<RegistrationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
