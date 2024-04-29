// portfolio.service.ts
import { Injectable } from '@angular/core';
import { Portfolio } from './portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolios: Portfolio[] = [
    { id: 1, name: 'Coop', email: 'coop@gmail.com' },
    { id: 2, name: 'Lots', email: 'lots@gmail.com' },
    { id: 3, name: 'Folk', email: 'folk@gmail.com' }
  ];

  constructor() {}

  getPortfolios(): Portfolio[] {
    return this.portfolios;
  }

  getPortfolioByName(name: string): Portfolio | undefined {
    return this.portfolios.find(portfolio => portfolio.name === name);
  }

  getPortfolioById(id: number): Portfolio | undefined {
    return this.portfolios.find(portfolio => portfolio.id === id);
  }
}
