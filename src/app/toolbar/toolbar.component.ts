import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { PortfolioService } from '../portfolio.service';
import { Portfolio } from '../portfolio.model'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit{
  // Add any necessary logic or properties for the toolbar component
  portfolios: Portfolio[] = [];

  constructor(private portfolioService: PortfolioService, private router: Router) {}

  dropdownVisible = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  hideDropdown() {
    this.dropdownVisible = false;
  }

  selectPortfolio(portfolio: Portfolio) {
    // Do something with the selected portfolio, e.g., navigate to its page
    console.log('Selected portfolio:', portfolio);
    this.dropdownVisible = false; // Hide the dropdown after selection
    this.router.navigate(['/portfolio', portfolio.name]);

  }

  ngOnInit(): void {
    this.portfolios = this.portfolioService.getPortfolios();
  }
}
