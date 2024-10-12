import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContactosComponent } from './dialog-contactos.component';

describe('DialogContactosComponent', () => {
  let component: DialogContactosComponent;
  let fixture: ComponentFixture<DialogContactosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContactosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogContactosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
