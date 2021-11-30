import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGiversComponent } from './admin-givers.component';

describe('AdminGiversComponent', () => {
  let component: AdminGiversComponent;
  let fixture: ComponentFixture<AdminGiversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGiversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGiversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
