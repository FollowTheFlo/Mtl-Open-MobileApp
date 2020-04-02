import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlayerCreatePage } from './player-create.page';

describe('PlayerCreatePage', () => {
  let component: PlayerCreatePage;
  let fixture: ComponentFixture<PlayerCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
