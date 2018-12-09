import { AbstractControl, FormGroup } from "@angular/forms";

export class CustomValidators {
  static equalTo(myString: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const val: string = control.value;
      if (val === myString) {
        return null;
      } else {
        return { equalTo: true };
      }
    };
  }

  static confirmPass(group: FormGroup) {
    const passCtrl = group.controls.hash;
    const confirmPassCtrl = group.controls.confHash;

    const pass = passCtrl.value;
    const confirmPass = confirmPassCtrl.value;
    if (confirmPassCtrl.touched) {
      if (pass === confirmPass) {
        confirmPassCtrl.setErrors(null);
      } else {
        confirmPassCtrl.setErrors({ notMatch: true });
      }
    }
    return null;
  }
}
