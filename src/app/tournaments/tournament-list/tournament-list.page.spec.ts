import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TournamentListPage } from './tournament-list.page';

describe('TournamentListPage', () => {
  let component: TournamentListPage;
  let fixture: ComponentFixture<TournamentListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
