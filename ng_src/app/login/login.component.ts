import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFG: FormGroup;
  validatorsErrorMsg = {
    email : {
      required : 'email is requied',
      email : 'please enter a valid email'
    },
    hash : {
      required : 'password is requied',
      minlength : 'minimum length is 4'
    }
  };
  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder ) { }

  ngOnInit() {
   this.loginFG = this.fb.group({
     email : ['', [Validators.required, Validators.email]],
     hash : ['', [Validators.required, Validators.minLength(1)]] // password TODO hash the pasword
   });
  }
  getErrorMsg(ctrlName) {
    const errors = this.loginFG.controls[ctrlName].errors;
    const errorKey = Object.keys(errors)[0];
    return this.validatorsErrorMsg[ctrlName][errorKey];
  }
  loginUser() {
    const loginUserData = this.loginFG.value;
    this.auth.loginUser(loginUserData)
    .subscribe(
      res => {
        console.log(res);
        localStorage.setItem('token', res.token );
        this.router.navigate(['/home']);
      },
      err => console.log(err)
    );
  }

}
