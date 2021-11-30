import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidDetailsComponent } from './kid-details.component';

describe('KidDetailsComponent', () => {
  let component: KidDetailsComponent;
  let fixture: ComponentFixture<KidDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KidDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KidDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
