import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IMechanic, IMechanicCredential, IMechanicExpertise, IMechanicField, IMechanicService } from 'projects/carmaster/src/app/interfaces/carmaster.interface';
import { CarmasterService } from 'projects/carmaster/src/app/services/carmaster.service';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { IFormSubmitEvent, IGoogleAutocompleteEvent, IUserSubscriptionInfo } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { EnvironmentService } from 'projects/common/src/app/services/environment.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { UsersService } from 'projects/common/src/app/services/users.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { COMMON_TEXT_FORM_LIMIT } from 'projects/common/src/app/_misc/vault';
import { combineLatest, finalize, Subject, Subscription } from 'rxjs';



@Component({
  selector: 'carmaster-mechanic-profile-page',
  templateUrl: './mechanic-profile-page.component.html',
  styleUrls: ['./mechanic-profile-page.component.scss']
})
export class MechanicProfilePageComponent implements OnInit, AfterViewInit {
  you: IUser | null = null;
  user: IUser | null = null;
  user_subscription_info: IUserSubscriptionInfo | null = null;
  TEXT_FORM_LIMIT = COMMON_TEXT_FORM_LIMIT;
  locationInput?: HTMLInputElement;

  googleIsReadySub?: Subscription;
  autoCompleteSub?: Subscription;
  autoCompleteSubject?: Subject<IGoogleAutocompleteEvent>;
  autoCompleteResults: IGoogleAutocompleteEvent | null = null;

  autocomplete?: any;
  manage: PlainObject = {};
  cityQuery?: string;
  zipcodeQuery?: string;
  placeData: PlainObject = {};
  mechanic_profile: IMechanic | null = null;
  loading: boolean = false;
  google: any;

  profileForm = new UntypedFormGroup({
    bio: new UntypedFormControl('', []),
    website: new UntypedFormControl('', []),
    phone: new UntypedFormControl('', []),
    email: new UntypedFormControl('', []),
  });

  showSectionsMap: PlainObject<boolean> = {
    info: true,
    fields: true,
    credentials: true,
    expertises: true,
    services: true,
    ratings: true,
  };

  get isYou(): boolean {
    const isYours = (
      this.you && 
      this.user &&
      this.user.id === this.you.id
    );
    return !!isYours;
  };

  get isUserActiveMember(): boolean {
    const match = !!this.user_subscription_info && this.user_subscription_info.active;
    return match;
  }

  constructor(
    private userStore: UserStoreService,
    private userService: UsersService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private googleService: GoogleMapsService,
    private envService: EnvironmentService,
    private carmasterService: CarmasterService,
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.userStore.getChangesObs(),
      this.route.parent!.parent!.data,
      this.route.parent!.data,
    ]).subscribe({
      next: (values) => {
        console.log(values);

        const [you, userParentData, mechanicParentData] = values;
        
        this.you = you;

        this.user = userParentData['user'];
        this.user_subscription_info = userParentData['user_subscription_info'];
        this.mechanic_profile = mechanicParentData['mechanic_profile'];

        if (this.isYou && !!this.mechanic_profile) {
          this.profileForm.setValue({
            bio: this.mechanic_profile.bio || '',
            website: this.mechanic_profile.website || '',
            phone: this.mechanic_profile.phone || '',
            email: this.mechanic_profile.email || '',
          });
        }
      }
    });

  }
  
  ngAfterViewInit() {
    this.locationInput = <HTMLInputElement> window.document.getElementById('location-input');
    console.log('location-input', this.locationInput);
    this.googleIsReadySub = this.googleService.isReady().subscribe(
      (google: any) => {
        if (google) {
          this.google = google;
          if (this.googleIsReadySub) {
            this.googleIsReadySub.unsubscribe();
          }
          this.initGoogle(google);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  initGoogle(google: any) {
    console.log(`initializing autocomplete`);
    if (!this.locationInput) {
      return;
    }
    
    this.autoCompleteSubject = this.googleService.makeTextInputIntoLocationAutoComplete(this.locationInput);
    this.autoCompleteSub = this.autoCompleteSubject!.subscribe({
      next: (results) => {
        console.log(results);
        this.autoCompleteResults = results;
      }
    });
  }

  createMechanicProfile() {
    this.loading = true;
    this.carmasterService.create_mechanic_profile(this.you!.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.mechanic_profile = response.data!;
        setTimeout(() => {
          this.initGoogle(this.google);
        })
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  onProfileInfoSubmit() {
    if (this.profileForm.invalid) {
      return console.warn(`profileForm not valid`, this);
    }

    const data = this.autoCompleteResults
      ? { ...this.profileForm.value, ...this.autoCompleteResults.placeData }
      : { ...this.profileForm.value };

    this.loading = true;
    this.carmasterService.update_mechanic_profile(this.mechanic_profile!.id, data)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.mechanic_profile = response.data![1];
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  createField($event: IFormSubmitEvent) {
    if (!$event) {
      return;
    }

    this.loading = true;
    this.carmasterService.create_mechanic_field(this.mechanic_profile!.id, $event.payload)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.mechanic_profile!.mechanic_fields!.unshift(response.data!);
        $event.resetForm && $event.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  createCredential($event: IFormSubmitEvent) {
    if (!$event) {
      return;
    }

    this.loading = true;
    this.carmasterService.create_mechanic_credential(this.mechanic_profile!.id, $event.formData)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.mechanic_profile!.mechanic_credentials!.unshift(response.data!);
        $event.resetForm && $event.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  createExpertise($event: IFormSubmitEvent) {
    if (!$event) {
      return;
    }

    this.loading = true;
    this.carmasterService.create_mechanic_expertise(this.mechanic_profile!.id, $event.payload)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.mechanic_profile!.mechanic_expertises!.unshift(response.data!);
        $event.resetForm && $event.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  createService($event: IFormSubmitEvent) {
    if (!$event) {
      return;
    }

    this.loading = true;
    this.carmasterService.create_mechanic_service(this.mechanic_profile!.id, $event.payload)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.mechanic_profile!.mechanic_services!.unshift(response.data!);
        $event.resetForm && $event.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  createRating($event: IFormSubmitEvent) {
    if (!$event) {
      return;
    }

    const ask = window.confirm(`Are you sure you want to create this review? It cannot be edited or deleted later.`);
    if (!ask) {
      return;
    }

    this.loading = true;
    this.carmasterService.create_mechanic_rating(this.mechanic_profile!.id, $event.payload)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.mechanic_profile!.mechanic_ratings!.unshift(response.data!);
        $event.resetForm && $event.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  deleteField(field: IMechanicField) {
    if (!field) {
      return;
    }

    const ask = window.confirm(`Delete this field?`);
    if (!ask) {
      return;
    }
  
    this.loading = true;
    this.carmasterService.delete_mechanic_field(this.mechanic_profile!.id, field.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        const index = this.mechanic_profile!.mechanic_fields!.indexOf(field);
        this.mechanic_profile!.mechanic_fields!.splice(index, 1);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }
  
  deleteCredential(credential: IMechanicCredential) {
    if (!credential) {
      return;
    }
  
    const ask = window.confirm(`Delete this credential?`);
    if (!ask) {
      return;
    }
  
    this.loading = true;
    this.carmasterService.delete_mechanic_credential(this.mechanic_profile!.id, credential.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        const index = this.mechanic_profile!.mechanic_credentials!.indexOf(credential);
        this.mechanic_profile!.mechanic_credentials!.splice(index, 1);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }
  
  deleteExpertise(expertise: IMechanicExpertise) {
    if (!expertise) {
      return;
    }
  
    const ask = window.confirm(`Delete this expertise?`);
    if (!ask) {
      return;
    }
  
    this.loading = true;
    this.carmasterService.delete_mechanic_expertise(this.mechanic_profile!.id, expertise.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        const index = this.mechanic_profile!.mechanic_expertises!.indexOf(expertise);
        this.mechanic_profile!.mechanic_expertises!.splice(index, 1);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }
  
  deleteService(service: IMechanicService) {
    if (!service) {
      return;
    }
  
    const ask = window.confirm(`Delete this service?`);
    if (!ask) {
      return;
    }
  
    this.loading = true;
    this.carmasterService.delete_mechanic_service(this.mechanic_profile!.id, service.id)
    .pipe(finalize(() => { this.loading = false; }))
    .subscribe({
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        const index = this.mechanic_profile!.mechanic_services!.indexOf(service);
        this.mechanic_profile!.mechanic_services!.splice(index, 1);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }
}
