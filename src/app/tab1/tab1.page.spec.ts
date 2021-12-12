import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabPractice } from './tab1.page';

describe('Tab1Page', () => {
  let component: TabPractice;
  let fixture: ComponentFixture<TabPractice>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TabPractice],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabPractice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
