import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopupTournamentPage } from './popup-tournament.page';

describe('PopupTournamentPage', () => {
  let component: PopupTournamentPage;
  let fixture: ComponentFixture<PopupTournamentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopupTournamentPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupTournamentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
