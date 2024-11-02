
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesByYearComponent } from './sales-by-year.component';

describe('SalesByRegionComponent', () => {
  let component: SalesByYearComponent;
  let fixture: ComponentFixture<SalesByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SalesByYearComponent] // Import SalesByRegionComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Sales by Year"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sales by Year');
  });

  it('should initialize the yearForm with a null value', () => {
    const yearControl = component.yearForm.controls['year'];
    expect(yearControl.value).toBeNull();
    expect(yearControl.valid).toBeFalse();
  });

  it('should not submit the form if no year is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.yearForm.valid).toBeFalse();
  });
});




/*
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByYearComponent } from './sales-by-year.component';

describe('SalesByYearComponent', () => {
  let component: SalesByYearComponent;
  let fixture: ComponentFixture<SalesByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByYearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/