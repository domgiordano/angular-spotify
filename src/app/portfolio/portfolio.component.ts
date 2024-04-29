// portfolio.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortfolioService } from '../portfolio.service';
import { Portfolio } from '../portfolio.model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolio: Portfolio | undefined;
  portfolioName: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: { [x: string]: any; }) => {
      const name = params['name'];
      this.portfolio = this.portfolioService.getPortfolioByName(name);
      this.portfolioName = name;
      if (!this.portfolio) {
        // Handle the case where the portfolio is not found
        console.error('Portfolio not found');
      }
    });
  }
}
