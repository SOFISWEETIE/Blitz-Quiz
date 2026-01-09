import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface JuegoGuard {
    puedeSalir(): boolean | Promise<boolean>;
}

@Injectable({
providedIn: 'root'
})
export class JuegoGuardService implements CanDeactivate<JuegoGuard> {
    canDeactivate(component: JuegoGuard): Promise<boolean> | boolean {
    return component.puedeSalir();
    }
}
