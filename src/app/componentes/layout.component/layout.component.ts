import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { RankingComponent } from '../ranking.component/ranking.component';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RankingComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

   alias$: Observable<string | null> = of(null);
  
  constructor(public auth: AuthService, private router: Router) {
    
    // obtener el alias al iniciar la aplicación
    this.alias$ = this.auth.user$.pipe(
      switchMap(user => {
        if (!user) return of(null);
        return this.auth.verificarAlias();
      })
    );
  }

  //metodo para cerrar sesion
  async salir() {
    await this.auth.logout();               // cierra sesion en Firebase
    await this.router.navigate(['/login']);  // redirige al login
  }

  cambiarAlias() {
    this.router.navigate(['/app/crear-alias']);
  }

}

