import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ChartComponent } from '../../../shared/chart/chart.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales-by-year',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ChartComponent],
  providers: [DatePipe],
  template: `
    <h1>Sales by Year</h1>
    <div class="year-container">
      <form class="form" [formGroup]="yearForm" (ngSubmit)="onSubmit()">

      @if (errorMessage) {
          <div class="message message--error">{{ errorMessage }} </div>
        }
        <div class="form__group">
          <label class="label" for="year">Year</label>
          <select class="select" formControlName="year" id="year" name="year">
            @for(year of years; track year) {
              <option value="{{ year.value }}">{{ year.name }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      @if (totalSales.length && salesPeople.length) {
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Sales by Year'"
            [data]="totalSales"
            [labels]="salesPeople">
          </app-chart>
        </div>
      }
    </div>
  `,
  styles: [`
    .year-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
    }
  `]
})

export class SalesByYearComponent {
  totalSales: number[] = [];
  salesPeople: string[] = [];
  salesPerson: string[] = [];
  years: any[] = [];
  errorMessage: string;

  yearForm = this.fb.group({
    year: [null, Validators.compose([Validators.required])]
  });

  constructor(private http: HttpClient, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.years = this.loadYears();
    this.errorMessage = '';
  }

  loadYears() {
    return [
      { value: 2022, name: '2022' },
      { value: 2023, name: '2023' },
      { value: 2024, name: '2024' },
    ]
  }

  onSubmit() {
    if (this.yearForm.invalid) {
      this.errorMessage = 'Please select a year';
      return;
    }

    const year = this.yearForm.controls['year'].value;
    this.http.get(`${environment.apiBaseUrl}/reports/sales/sales-by-year?year=${year}`).subscribe({
      next: (data: any) => {
        if (data.length === 0) {
          const selectedYear = this.years.find(m => m.value === Number(year));
          console.error('No data found for', selectedYear.name);
          this.errorMessage = `No data found for ${selectedYear.name}`
          return;
        }



        console.log(`salesperson: ${this.salesPerson}\n Total Sales: ${this.totalSales}`);

        this.totalSales = data.map((s: any) => s.totalSales);
        this.salesPeople = data.map((s: any) => s.salesperson);

        console.log('totalSales', this.totalSales);
        console.log('salesPeople', this.salesPeople);

        // Trigger change detection
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching sales by year data:', err);
      }
    });
  }
}

