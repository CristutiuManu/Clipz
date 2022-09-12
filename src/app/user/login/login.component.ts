import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  showAlert: boolean = false;
  alertMessage: string = 'Please wait! We are logging you in.';
  alertColor: string = 'blue';
  inSubmission: boolean = false;

  constructor(private auth: AngularFireAuth) { }

  async login(): Promise<void> {
    this.showAlert = true;
    this.alertMessage = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      );
    } catch (error) {
      this.inSubmission = false;
      this.alertMessage = 'An unexpected error occured. Please try again later.';
      this.alertColor = 'red';

      console.log(error);

      return
    }

    this.alertMessage = 'Success! You are now logged in.';
    this.alertColor = 'green';
  }

}
