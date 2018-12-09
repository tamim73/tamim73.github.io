import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { CustomValidators } from '../shared/customValidators';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerFG: FormGroup;
  matcher = new MyErrorStateMatcher();
  validatorsErrorMsg = {
    firstName : {
      required : 'first name is requied',
    },
    lastName : {
      required : 'last name is requied',
    },
    email : {
      required : 'email is requied',
      email : 'please enter a valid email'
    },
    hash : {
      required : 'password is requied',
      minlength : 'minimum length is 4'
    },
    confHash : {
      notMatch : 'password doesn\'t match',
    },
    gender : {
      required : 'gender is requied',
    },
  };
  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.registerFG = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName : ['', [Validators.required]],
      email    : ['', [Validators.required, Validators.email]],
      hash     : ['', [Validators.required]], // password
      confHash : ['',],        // confim password
      gender   : ['', [Validators.required]],
    }, { validator : CustomValidators.confirmPass});
  }
  getErrorMsg(ctrlName) {
    const errors = this.registerFG.controls[ctrlName].errors;
    const errorKey = Object.keys(errors)[0];
    return this.validatorsErrorMsg[ctrlName][errorKey];
  }
  //  register
  registerUser() {
    const registerUserData = this.registerFG.value;
    this.auth.registerUser(registerUserData)
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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}