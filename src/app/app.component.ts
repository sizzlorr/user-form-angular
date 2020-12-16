import { Component, OnInit } from '@angular/core';
import { UserFormService } from './services/user-form.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private userFormService: UserFormService) { }

  ngOnInit() {
    this.userFormService.init();
  }
}
