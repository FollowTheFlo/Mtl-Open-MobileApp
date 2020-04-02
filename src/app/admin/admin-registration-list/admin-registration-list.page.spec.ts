import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminRegistrationListPage } from './admin-registration-list.page';

describe('AdminRegistrationListPage', () => {
  let component: AdminRegistrationListPage;
  let fixture: ComponentFixture<AdminRegistrationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRegistrationListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRegistrationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
