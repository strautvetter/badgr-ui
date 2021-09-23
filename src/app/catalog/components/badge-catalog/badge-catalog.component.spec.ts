import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeCatalogComponent } from './badge-catalog.component';

describe('BadgeCatalogComponent', () => {
  let component: BadgeCatalogComponent;
  let fixture: ComponentFixture<BadgeCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
