import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Country, Language, UserData } from '../../models/user-form.model';
import { UserFormService } from '../../services/user-form.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  private subscriptions$ = new Subscription();
  userForm: FormGroup;
  editMode = false;
  countries: Country[];
  languages: Language[];
  userData: UserData;

  constructor(private fb: FormBuilder, private userFormService: UserFormService) { }

  ngOnInit() {
    this.subscriptions$.add(this.userFormService.getCountries().subscribe((countries: Country[]) => {
      this.countries = countries;
    }));
    this.subscriptions$.add(this.userFormService.getLanguages().subscribe(languages => {
      this.removeDubs(languages);
    }));

    this.buildForm();
  }

  private buildForm() {
    this.userData = JSON.parse(localStorage.getItem('userData'));

    this.userForm = this.fb.group({
      name: [{ value: '', disabled: !this.editMode }, Validators.required],
      birtDate: [{ value: '', disabled: !this.editMode }, Validators.required],
      country: [{ value: '', disabled: !this.editMode }, Validators.required],
      languages: [{ value: '', disabled: !this.editMode }, Validators.required],
      gender: [{ value: '', disabled: !this.editMode }, Validators.required]
    });

    if (this.userData) {
      this.patchForm();
    }
  }

  submitForm() {
    if (this.editMode) {
      this.saveForm();
    }
    this.toggleFormState();
  }

  cancelForm() {
    this.toggleFormState();
    if (this.userData) {
      this.patchForm();
    } else {
      this.buildForm();
    }
  }

  private saveForm() {
    if (this.userForm.invalid) {
      return;
    }
    localStorage.setItem('userData', JSON.stringify(this.userForm.value));
  }

  private toggleFormState() {
    this.editMode = !this.editMode;
    const state = this.editMode ? 'enable' : 'disable';

    Object.keys(this.userForm.controls).forEach((controlName) => {
      this.userForm.controls[controlName][state]();
    });
  }

  private patchForm() {
    Object.keys(this.userForm.controls).forEach((controlName) => {
      this.userForm.get(controlName).patchValue(this.userData[controlName]);
    });
  }

  private removeDubs(languages: any) {
    const oneArr = [];

    languages.forEach(l => {
      l.forEach(la => oneArr.push(la));
    });

    this.languages = oneArr.filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i );
  }

  ngOnDestroy() {
    try {
      this.subscriptions$.unsubscribe();
    } catch (e) {}
  }
}
