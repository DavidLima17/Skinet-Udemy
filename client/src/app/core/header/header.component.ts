import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  breadcrumb$: Observable<any[]>
  constructor(private bcServices: BreadcrumbService) { }

  ngOnInit(): void {
    this.breadcrumb$ = this.bcServices.breadcrumbs$;
  }

}
