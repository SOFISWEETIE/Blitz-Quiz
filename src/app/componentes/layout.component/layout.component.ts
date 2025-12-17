import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { RankingComponent } from '../ranking.component/ranking.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RankingComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

   aliasData$: BehaviorSubject<{ alias: string; mascota: string } | null>;
   menuAbierto = false;
  
    constructor(public auth: AuthService, private router: Router) {
    this.aliasData$ = this.auth.alias$;
    }

    toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    }

    async salir() {
      await this.auth.logout();
      await this.router.navigate(['/login']);
    }

    cambiarAlias() {
      this.menuAbierto = false;
      this.router.navigate(['/app/crear-alias']);
    }

}

