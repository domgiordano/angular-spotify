import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit{

  ngOnInit(): void {
    console.log("INITIALIZED!!!!")
  }
}
