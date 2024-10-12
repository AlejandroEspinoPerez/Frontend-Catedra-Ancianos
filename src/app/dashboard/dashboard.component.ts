import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Data variables
  dataAncianos: any;
  dataContactos: any;
  dataEnfermedades: any;

  // Counts and totals
  cantAncianos = 0;
  cantContactos = 0;
  cantEnfermedades = 0;
  total = 30;  // Total base para calcular porcentajes

  // Percentages
  porCientoAncianos = 0;
  porCientoContactos = 0;
  porCientoEnfermedades = 0;

  logueado = !this.service.IsloggedIn();

  constructor(private service: ApiService) { }

  ngOnInit(): void {
    // Fetch data for all categories in parallel
    forkJoin({
      ancianos: this.service.getAllAncianos(),
      contactos: this.service.getAllContactos(),
      enfermedades: this.service.getAllEnfermedades()
    }).subscribe(({ ancianos, contactos, enfermedades }) => {
      // Handle Ancianos data
      if (ancianos) {
        this.cantAncianos = ancianos.length;
        this.porCientoAncianos = this.calculatePercentage(ancianos.length);
      }
      // Handle Contactos data
      if (contactos) {
        this.cantContactos = contactos.length;
        this.porCientoContactos = this.calculatePercentage(contactos.length);
      }
      // Handle Enfermedades data
      if (enfermedades) {
        this.cantEnfermedades = enfermedades.length;
        this.porCientoEnfermedades = this.calculatePercentage(enfermedades.length);
      }

      // Now render the chart after data is loaded
      this.renderChart();
    });
  }

  // Method to calculate percentages
  calculatePercentage(count: number): number {
    return Math.floor((100 * count) / this.total);
  }

  // Render chart method
  renderChart(): void {
    new Chart('piechart', {
      type: 'bar',
      data: {
        labels: ['Ancianos', 'Contactos', 'Enfermedades'],
        datasets: [{
          label: 'Cantidad',
          data: [this.cantAncianos, this.cantContactos, this.cantEnfermedades],
          backgroundColor: ['red', 'blue', 'green'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
