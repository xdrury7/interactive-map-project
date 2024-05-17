import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-world-map',
  standalone: true,
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css'],
  imports: [CommonModule]
})
export class WorldMapComponent implements OnInit {
  countryData: any;

  constructor(
    private elementRef: ElementRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadSVG();
  }

  async loadSVG(): Promise<void> {
    const svgPath = '/assets/map-image.svg'; 
    const svgContainer = this.elementRef.nativeElement.querySelector('.svg-container');

    await fetch(svgPath)
      .then(response => response.text())
      .then(svgData => {
        svgContainer.innerHTML = svgData;
        this.addHoverEvents();
      });
  }

  addHoverEvents(): void {
    const paths = this.elementRef.nativeElement.querySelectorAll('path');
    paths.forEach((path:SVGPathElement) => {
      path.addEventListener('mouseover', () => {
        this.onCountryHover(path.id); 
        path.style.fill = 'lightblue';
      });
      path.addEventListener('mouseout', () => {
        path.style.fill = ''; 
      });
    });
  }

  onCountryHover(countryId: string): void {
    this.getCountryData(countryId);
  }

  getCountryData(countryId: string): void {
    const apiUrl = `https://api.worldbank.org/v2/country/${countryId}?format=json`;
    this.http.get<any>(apiUrl).subscribe(
      response => {
        console.log('API Response:', response);
        this.countryData = response[1][0]; 
      },
      error => {
        console.error('API Error:', error);
      }
    );
  }
}
