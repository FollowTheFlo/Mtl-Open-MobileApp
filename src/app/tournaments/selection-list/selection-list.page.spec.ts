import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectionListPage } from './selection-list.page';

describe('SelectionListPage', () => {
  let component: SelectionListPage;
  let fixture: ComponentFixture<SelectionListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
