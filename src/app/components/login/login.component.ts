import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  objLogin: any = {
    username: "admin",
    password: "admin",
  };
  error: boolean = false;
  constructor(private router : Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem("loggedin") && sessionStorage.getItem("loggedin") == "1"){
      this.router.navigate(['transctions']);
    }
  }

  login() {
    var username = this.objLogin.username;
    var password = this.objLogin.password;
    if (username == "admin" && password == "admin") {
      sessionStorage.setItem("loggedin", "1");
      this.router.navigate(['transctions']);
    }else{
      this.error = true;
    }
  }
}
