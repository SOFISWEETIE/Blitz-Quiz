import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';


@Component({
  selector: 'app-crear-alias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear.alias.component.html',
  styleUrls: ['./crear.alias.component.css']
})
export class CrearAliasComponent {

  alias = '';

  constructor(private auth: AuthService, private router: Router) {}

  guardar() {
    if (this.alias.trim().length < 3) {
      alert('El alias debe tener  3 caracteres');
      return;
    }

    this.auth.user$.pipe(take(1)).subscribe(user => {
      if (!user) return;

      this.auth.guardarAlias(user.uid, this.alias)
        .then(() => this.router.navigate(['/app/modos']));
    });
  }
}
