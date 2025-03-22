import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule,TooltipModule, CollapseModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'basket-app';
}
