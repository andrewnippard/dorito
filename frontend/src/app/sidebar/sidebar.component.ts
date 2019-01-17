import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export class SidebarApp {
  id : number;
  name : string;
  href : string;
  icon : string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  sidebarApps : SidebarApp[] = [
    {
      id: 1,
      name: 'Dashboard',
      href: 'dashboard',
      icon: 'fa fa-home'
    },
    {
      id: 2,
      name: 'Calc',
      href: 'calc',
      icon: 'fa fa-genderless'
    }
  ];
  selectedSidebarApp : SidebarApp;

  constructor(private router : Router) { }

  ngOnInit() {
  }

  onSelect(sidebarApp : SidebarApp) : void {
    this.selectedSidebarApp = sidebarApp;
    this.router.navigateByUrl(sidebarApp.href);
  }

}
