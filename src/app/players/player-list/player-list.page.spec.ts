import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayerListPage } from './player-list.page';

describe('PlayerListPage', () => {
  let component: PlayerListPage;
  let fixture: ComponentFixture<PlayerListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
