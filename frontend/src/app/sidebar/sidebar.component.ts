import { Component, OnInit } from '@angular/core';

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
      name: 'Reports',
      href: 'reports',
      icon: 'fa fa-file'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
