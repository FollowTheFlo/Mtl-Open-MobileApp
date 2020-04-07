import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupChartsPage } from './popup-charts.page';

describe('PopupChartsPage', () => {
  let component: PopupChartsPage;
  let fixture: ComponentFixture<PopupChartsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopupChartsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupChartsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
