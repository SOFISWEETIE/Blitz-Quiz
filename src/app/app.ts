import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule,HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']

})
export class App {
  protected readonly title = signal('Blitz-Quiz');
}
