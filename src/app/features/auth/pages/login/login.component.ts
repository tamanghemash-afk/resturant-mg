import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { UserRole } from '../../../../core/models/restaurant.model';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
      <div class="w-full max-w-md">
        <div class="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl shadow-2xl">
          <div class="text-center mb-8">
            <div class="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
              <span class="text-xs font-bold text-zinc-200">A</span>
            </div>
            <h2 class="text-xl font-bold text-white tracking-tight">Switch Role</h2>
            <p class="text-xs text-zinc-400 mt-1">Select a workspace role to continue</p>
          </div>
          <div class="space-y-3">
            @for (r of roles; track r) {
              <button
                (click)="selectRole(r)"
                [class]="
                  service.role() === r
                    ? 'w-full py-3.5 rounded-xl bg-white text-zinc-900 text-sm font-medium shadow-lg'
                    : 'w-full py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-900 hover:border-zinc-700 transition-colors active:scale-95'
                "
              >
                {{ r }} Mode
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  service = inject(RestaurantService);
  router = inject(Router);
  roles: UserRole[] = ['Admin', 'Staff', 'Customer'];

  selectRole(role: UserRole) {
    this.service.setRole(role);
    this.router.navigate(['/tables']);
  }
}
