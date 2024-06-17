import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Chart } from 'chart.js/auto';
import { SensorData } from '../data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nodeId: string = '';
  lastValue: number = 0;
  lastTimestamp: string = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchLastRecords();
    this.fetchAllRecords();
  }

  fetchLastRecords(): void {
    this.dataService.getLastRecords().subscribe((data: SensorData[]) => {
      if (data.length > 0) {
        const latestData = data[0];
        console.log('Latest data:', latestData); // Log the latest data
        
        // Acceder directamente a la propiedad value
        const parsedTimestamp = latestData.tiempo_registro.value;
        console.log('Parsed Timestamp:', parsedTimestamp); // Log the parsed timestamp
        this.lastTimestamp = new Date(parsedTimestamp).toLocaleString(); // Formatear la fecha correctamente

        this.nodeId = latestData.dev_id;
        this.lastValue = latestData.temperatura;
      }
    });
  }

  fetchAllRecords(): void {
    this.dataService.getAllRecords().subscribe((data: SensorData[]) => {
      this.plotChart(
        data.map(d => new Date(d.tiempo_registro.value).toLocaleString()), // Asegurarse de que las fechas sean objetos Date
        data.map(d => d.temperatura),
        data.map(d => d.humedad)
      );
    });
  }

  plotChart(dateSeries: string[], tempSeries: number[], humSeries: number[]): void {
    if (typeof document !== 'undefined') {
      const canvas = document.getElementById('tempHumidityChart') as HTMLCanvasElement | null;
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context not found');
        return;
      }

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: dateSeries, // Usar índices como etiquetas
          datasets: [
            {
              label: 'Temperatura',
              data: tempSeries,
              borderColor: 'red',
              fill: false
            },
            {
              label: 'Humedad',
              data: humSeries,
              borderColor: 'blue',
              fill: false
            }
          ]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Índice'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Valores'
              }
            }
          }
        }
      });
    }
  }
}