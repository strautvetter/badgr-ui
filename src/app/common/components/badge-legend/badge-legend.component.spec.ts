import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeLegendComponent } from './badge-legend.component';

describe('BadgeLegendComponent', () => {
  let component: BadgeLegendComponent;
  let fixture: ComponentFixture<BadgeLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
