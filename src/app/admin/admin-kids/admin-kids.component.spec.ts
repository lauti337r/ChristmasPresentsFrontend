import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKidsComponent } from './admin-kids.component';

describe('AdminKidsComponent', () => {
  let component: AdminKidsComponent;
  let fixture: ComponentFixture<AdminKidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminKidsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminKidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
