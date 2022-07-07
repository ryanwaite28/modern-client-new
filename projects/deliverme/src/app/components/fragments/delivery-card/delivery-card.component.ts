import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertDivClass, MODERN_APPS } from 'projects/common/src/app/enums/all.enums';
import { PlainObject } from 'projects/common/src/app/interfaces/json-object.interface';
import { IUser } from 'projects/common/src/app/interfaces/user.interface';
import { INavigatorGeoLocation } from 'projects/common/src/app/interfaces/_common.interface';
import { AlertService } from 'projects/common/src/app/services/alert.service';
import { GoogleMapsService } from 'projects/common/src/app/services/google-maps.service';
import { SocketEventsService } from 'projects/common/src/app/services/socket-events.service';
import { StripeService } from 'projects/common/src/app/services/stripe.service';
import { UserStoreService } from 'projects/common/src/app/stores/user-store.service';
import { getUserFullName } from 'projects/common/src/app/_misc/chamber';
import { finalize, flatMap } from 'rxjs/operators';
import { DELIVERME_EVENT_TYPES, DeliveryCardDisplayMode } from '../../../enums/deliverme.enum';
import { IDelivery } from '../../../interfaces/deliverme.interface';
import { DeliveryService } from '../../../services/delivery.service';

@Component({
  selector: 'deliverme-delivery-card',
  templateUrl: './delivery-card.component.html',
  styleUrls: ['./delivery-card.component.scss']
})
export class DeliveryCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('newDeliveryTrackingUpdateFormElm') newDeliveryTrackingUpdateFormElm: ElementRef<HTMLFormElement> | any;
  @ViewChild('paymentFormElm') paymentFormElm: ElementRef<HTMLFormElement> | any;
  
  @Input() you: IUser | any;
  @Input() delivery!: IDelivery;
  @Input() deliveryCardDisplayMode: DeliveryCardDisplayMode = DeliveryCardDisplayMode.DEFAULT;
  @Input() showEmbeddedContent: boolean = false;

  @Output() deliveryDelete = new EventEmitter<any>();
  @Output() deliveryCompleted = new EventEmitter<any>();
  @Output() deliveryReturned = new EventEmitter<any>();

  AlertDivClass = AlertDivClass;

  isEditing: boolean = false;
  loading: boolean = false;

  showDetails: boolean = false;
  showMessages: boolean = false;

  deliveryEventsListeners: any[] = [];
  payment_client_secret: any;
  DeliveryCardDisplayMode = DeliveryCardDisplayMode;

  newDeliveryTrackingUpdateForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
    file: new FormControl(null)
  });

  messageFormIsOpen = false;
  messages_list_end = false;
  MSG_MAX_LENGTH = 1000;
  messageForm = new FormGroup({
    body: new FormControl('', [
      Validators.required,
      // Validators.pattern(/(.*)+/),
      Validators.minLength(1),
      Validators.maxLength(this.MSG_MAX_LENGTH)
    ])
  });

  google: any;
  carrierRealTimeLocationMap = null;
  carrierRealTimeLocationMarker = null;

  get isDeliveryOwner(): boolean {
    const match = !!this.you && !!this.delivery && this.you.id === this.delivery.owner_id;
    return match;
  }

  get isDeliveryCarrier(): boolean {
    const match = !!this.you && !!this.delivery && this.you.id === this.delivery.carrier_id;
    return match;
  }

  get isDeliveryOwnerOrCarrier(): boolean {
    const match = !!this.you && !!this.delivery && (
      this.you.id === this.delivery.owner_id ||
      this.you.id === this.delivery.carrier_id
    );
    return match;
  }

  get deliveryStatusClassBox(): PlainObject {
    return {
      [AlertDivClass.success]: this.delivery.completed,
      [AlertDivClass.info]: !this.delivery.completed && this.delivery.carrier_id,
      [AlertDivClass.secondary]: !this.delivery.completed && !this.delivery.carrier_id,
    }
  }

  constructor(
    private userStore: UserStoreService,
    private alertService: AlertService,
    private deliveryService: DeliveryService,
    private googleMapsService: GoogleMapsService,
    private changeDetectorRef: ChangeDetectorRef,
    private socketEventsService: SocketEventsService,
    private stripeService: StripeService,
  ) { }

  ngOnInit(): void {
    this.messages_list_end = !!this.delivery && this.delivery.delivery_messages!.length < 5;
    if (!this.delivery) {
      console.warn(`delivery object not given...`, this);
      return;
    }

    if (this.delivery.deliverme_delivery_tracking_updates) {
      for (const tracking_update of this.delivery.deliverme_delivery_tracking_updates) {
        this.getLocationForTrackingUpdate(tracking_update);
      }
    }
    if (!this.delivery.completed && this.isDeliveryOwnerOrCarrier) {
      this.startEventListener();
    }
  }

  ngAfterViewInit(): void {
    this.googleMapsService.isReady().subscribe({
      next: (google) => {
        this.google = google;
        if (this.delivery.carrier_shared_location) {
          this.initCarrierLocationMapAndMarker();
          this.updateCarrierLocationMapAndMarker();
        }
      }
    });
  }

  ngOnDestroy() {
    for (const listener of this.deliveryEventsListeners) {
      listener.unsuscribe && listener.unsuscribe();
    }
    const deliveryRoom = `${DELIVERME_EVENT_TYPES.TO_DELIVERY}:${this.delivery.id}`;
    console.log(`Leaving ${deliveryRoom}`);
    this.socketEventsService.leaveRoom(deliveryRoom);
  }

  initCarrierLocationMapAndMarker() {
    const divId = 'delivery-' + this.delivery.id + '-carrier-location-map';
    const map = this.google
  }

  updateCarrierLocationMapAndMarker() {

  }

  startEventListener() {
    if (this.delivery) {
      const deliveryRoom = `${DELIVERME_EVENT_TYPES.TO_DELIVERY}:${this.delivery.id}`;
      console.log(`Joining ${deliveryRoom}...`);
      this.socketEventsService.joinRoom(deliveryRoom);



      const carrierAssignedListener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_ASSIGNED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery = event.data.delivery;
          }
        }
      });

      const carrierUnassignedListener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_UNASSIGNED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery = event.data.delivery;
          }
        }
      });

      const markedPickedListener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_MARKED_AS_PICKED_UP,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery = event.data.delivery;
          }
        }
      });

      const markedDroppedListener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_MARKED_AS_DROPPED_OFF,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery = event.data.delivery;
          }
        }
      });

      const trackingUpdateListener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.DELIVERY_NEW_TRACKING_UPDATE,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            const tracking_update = event.data;
            this.delivery.deliverme_delivery_tracking_updates?.unshift(tracking_update);
            this.getLocationForTrackingUpdate(tracking_update);
          }
        }
      });

      const deliveryCompletedListener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.DELIVERY_COMPLETED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.completed = true;
            this.deliveryCompleted.emit();
          }
        }
      });

      const deliveryReturnedListener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.DELIVERY_RETURNED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery = event.data.delivery;
            this.deliveryReturned.emit();
          }
        }
      });

      const newDeliveryMessageListener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.DELIVERY_NEW_MESSAGE,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.delivery_messages!.push(event.data);
          }
        }
      });



      const carrierLocationRequested_listener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_LOCATION_REQUESTED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.carrier_location_requested = true;
            !!event.data && this.delivery.delivery_carrier_track_location_requests?.push(event.data);
          }
        }
      })

      const carrierLocationRequestAccepted_listener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_LOCATION_REQUEST_ACCEPTED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.carrier_shared_location = true;
            this.delivery.carrier_location_request_completed = true;
          }
        }
      });

      const carrierLocationRequestDeclined_listener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_LOCATION_REQUEST_DECLINED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.carrier_shared_location = false;
            this.delivery.carrier_location_request_completed = true;
          }
        }
      });

      const carrierLocationShared_listener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_LOCATION_SHARED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.carrier_shared_location = true;
            this.delivery.carrier_location_request_completed = true;
          }
        }
      });

      const carrierLocationUnshared_listener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_LOCATION_UNSHARED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.carrier_shared_location = false;
            this.delivery.carrier_location_request_completed = true;
          }
        }
      });

      const carrierLocationUpdated_listener = this.socketEventsService.listenToObservableEventStream(
        MODERN_APPS.DELIVERME,
        DELIVERME_EVENT_TYPES.CARRIER_LOCATION_UPDATED,
      ).subscribe({
        next: (event: any) => {
          if (event.delivery_id === this.delivery.id) {
            console.log(event);
            this.alertService.handleResponseSuccessGeneric({
              message: event.message
            });
            this.delivery.carrier_latest_lat = event.data.new_tracking_location_update.lat;
            this.delivery.carrier_latest_lng = event.data.new_tracking_location_update.lng;
          }
        }
      });


      this.deliveryEventsListeners = [
        carrierAssignedListener,
        carrierUnassignedListener,
        trackingUpdateListener,
        markedPickedListener,
        markedDroppedListener,
        deliveryCompletedListener,
        deliveryReturnedListener,
        newDeliveryMessageListener,

        carrierLocationRequested_listener,
        carrierLocationRequestAccepted_listener,
        carrierLocationRequestDeclined_listener,
        carrierLocationShared_listener,
        carrierLocationUnshared_listener,
        carrierLocationUpdated_listener,
      ];

      // console.log(`deliveryEventsListeners`, this.deliveryEventsListeners);
    }
  }

  onSubmitEditDelivery(params: any) {
    // const msg = `Are all input values correct? The delivery cannot be edited later.`;
    // const ask = window.confirm(msg);
    // if (!ask) {
    //   return;
    // }
    this.loading = true;
    this.deliveryService.update_delivery(params.formData, this.delivery.id).subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        params.resetForm && params.resetForm();
        this.loading = false;
        this.delivery = response.data.delivery;
        this.isEditing = false;
      },
      error: (error: any) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      },
    });
  }

  deleteDelivery() {
    const chargeFeeData = this.stripeService.add_on_stripe_processing_fee(this.delivery.payout);
    const refund_amount = chargeFeeData.final_total  - chargeFeeData.app_fee;
    const refund_amount_formatted = `$` + `${refund_amount}`;
    const ask = window.confirm(
      `Are you sure you want to delete this delivery? This action cannot be undone.`
    );
    if (!ask) {
      return;
    }
    this.deliveryDelete.emit();
  }

  onSubmitNewDeliveryTrackingUpdate(
    newDeliveryTrackingUpdateFormElm: HTMLFormElement,
    iconInputElm: HTMLInputElement
  ) {
    this.loading = true;
    this.googleMapsService.getCurrentLocation().subscribe({
      next: (location) => {
        const formData = new FormData(newDeliveryTrackingUpdateFormElm);

        const carrier_lat = location.lat;
        const carrier_lng = location.lng;
        const payload = {
          ...this.newDeliveryTrackingUpdateForm.value,
          carrier_lat,
          carrier_lng,
          file: undefined,
        };

        formData.append(`payload`, JSON.stringify(payload));
        console.log(newDeliveryTrackingUpdateFormElm, this);

        this.deliveryService.createTrackingUpdate(
          this.you!.id,
          this.delivery.id,
          formData
        ).subscribe({
          next: (response: any) => {
            this.alertService.handleResponseSuccessGeneric(response);
            this.loading = false;
            const tracking_update = response.data;
            this.delivery.deliverme_delivery_tracking_updates?.unshift(tracking_update);
            this.getLocationForTrackingUpdate(tracking_update);

            if (iconInputElm) {
              iconInputElm.value = '';
            }
            this.newDeliveryTrackingUpdateForm.reset({
              file: null,
              message: ''
            });
          },
          error: (error: any) => {
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  getLocationForTrackingUpdate(tracking_update: any) {
    this.googleMapsService.getLocationViaCoordinates(
      tracking_update.carrier_lat,
      tracking_update.carrier_lng,
    ).subscribe({
      next: (data: any) => {
        tracking_update.placeData = data.placeData;
        // console.log({ tracking_update, data });
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        
      },
    });
  }

  markDeliveryAsCompleted() {
    const ask = window.confirm(`Is this delivery been successfully delivered?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.deliveryService.markDeliveryAsCompleted(
      this.you!.id,
      this.delivery.id,
    ).subscribe({
      next: (response: any) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.loading = false;
        this.delivery.completed = true;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  sendDeliveryMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    this.loading = true;
    this.deliveryService.sendDeliveryMessage({
      body: this.messageForm.value.body,
      delivery_id: this.delivery.id
    }).subscribe({
      next: (response: any) => {
        this.alertService.showSuccessMessage(response.message);
        this.delivery.delivery_messages?.unshift(response.data);
        this.messageForm.setValue({ body: '' });
        this.messageForm.markAsPristine();
        this.messageForm.markAsUntouched();
        this.loading = false;
      }
    });
  }

  payCarrier() {
    // https://stripe.com/docs/connect/collect-then-transfer-guide

    const ask = window.confirm(`Are you ready to pay the carrier?`);
    if (!ask) {
      return;
    }
    
    this.loading = true;
    this.deliveryService.payCarrier(this.you!.id, this.delivery.id).subscribe({
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response: any) => {
        this.loading = false;
        this.delivery.completed = true;
        this.alertService.handleResponseSuccessGeneric(response);
      }
    });
  }

  request_carrier_location() {
    this.loading = true;
    this.deliveryService.request_carrier_location(this.delivery.id)
    .pipe(
      finalize(() => { this.loading = false; })
    )
    .subscribe({
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.delivery.carrier_location_requested = true;
        !!response.data && this.delivery.delivery_carrier_track_location_requests?.push(response.data);
      },
    });
  }

  accept_request_carrier_location() {
    this.loading = true;
    this.deliveryService.accept_request_carrier_location(this.delivery.id)
    .pipe(
      finalize(() => { this.loading = false; })
    )
    .subscribe({
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.delivery.carrier_location_requested = true;
        !!response.data && this.delivery.delivery_carrier_track_location_requests?.push(response.data);
      },
    });
  }

  decline_request_carrier_location() {
    this.loading = true;
    this.deliveryService.decline_request_carrier_location(this.delivery.id)
    .pipe(
      finalize(() => { this.loading = false; })
    )
    .subscribe({
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.delivery.carrier_location_requested = true;
        !!response.data && this.delivery.delivery_carrier_track_location_requests?.push(response.data);
      },
    });
  }

  carrier_share_location() {
    this.loading = true;
    this.deliveryService.carrier_share_location(this.delivery.id)
    .pipe(
      finalize(() => { this.loading = false; })
    )
    .subscribe({
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.delivery.carrier_shared_location = true;
      },
    });
  }

  carrier_unshare_location() {
    this.loading = true;
    this.deliveryService.carrier_unshare_location(this.delivery.id)
    .pipe(
      finalize(() => { this.loading = false; })
    )
    .subscribe({
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.delivery.carrier_shared_location = false;
      },
    });
  }

  carrier_update_location() {
    this.loading = true;

    this.googleMapsService.getCurrentLocation()
    .pipe(
      flatMap((location: INavigatorGeoLocation, index: number) => {
        return this.deliveryService.carrier_update_location({
          delivery_id: this.delivery.id,
          carrier_latest_lat: location.lat,
          carrier_latest_lng: location.lng,
        })
      }),
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe({
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response) => {
        this.alertService.handleResponseSuccessGeneric(response);
        this.delivery.delivery_carrier_track_location_updates?.push(response.data);
        this.delivery.carrier_latest_lat = response.data.lat;
        this.delivery.carrier_latest_lng = response.data.lng;
      },
    });
  }

  /**
   * @deprecated
   * @returns {undefined}
   */
  oldpayCarrier() {
    // https://stripe.com/docs/connect/collect-then-transfer-guide

    const ask = window.confirm(`Are you ready to pay the carrier?`);
    if (!ask) {
      return;
    }
    
    this.loading = true;
    this.deliveryService.createPaymentIntent(this.delivery.id).subscribe({
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.alertService.handleResponseErrorGeneric(error);
      },
      next: (response: any) => {
        this.loading = false;
        if (response.data.payment_client_secret) {
          this.payment_client_secret = response.data.payment_client_secret;
          this.alertService.handleResponseSuccessGeneric(response);
          
          const stripe = (<any> window).Stripe(response.data.stripe_pk, {
            // stripeAccount: this.you!.stripe_account_id
          });
          var elements = stripe.elements();
          var style = {
            base: {
              color: "#32325d",
            }
          };
          var card = elements.create("card", { style: style });
          const cardId = '#card-element-' + this.delivery.id;
          card.mount(cardId);

          card.on('change', (event: any) => {
            var displayError = document.getElementById('card-errors-' + this.delivery.id);
            if (event.error) {
              displayError!.textContent = event.error.message;
            } else {
              displayError!.textContent = '';
            }
          });

          const form = document.getElementById('payment-form-' + this.delivery.id);

          form!.addEventListener('submit', (ev) => {
            this.loading = true;
            ev.preventDefault();
            stripe.confirmCardPayment(this.payment_client_secret, {
              payment_method: {
                card: card,
                billing_details: {
                  email: this.delivery.owner!.email,
                  name: getUserFullName(this.delivery.owner!),
                  phone: this.delivery.owner!.phone,
                }
              }
            }).then((result: any) => {
              this.loading = false;
              console.log({ result });
              if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                console.log(result.error.message);
                this.alertService.showErrorMessage(result.error.message);
              } else {
                // The payment has been processed!
                if (result.paymentIntent.status === 'succeeded') {
                  // Show a success message to your customer
                  // There's a risk of the customer closing the window before callback
                  // execution. Set up a webhook or plugin to listen for the
                  // payment_intent.succeeded event that handles any business critical
                  // post-payment actions.
                  this.alertService.handleResponseSuccessGeneric({ message: `Payment successful!` });
                  
                  // wait a second to check if the server processed the payment.succeeded via stripe webhook
                  setTimeout(() => {
                    this.deliveryService.markDeliveryAsCompleted(
                      this.you!.id,
                      this.delivery.id,
                    ).subscribe({
                      next: (response: any) => {
                        this.alertService.handleResponseSuccessGeneric(response);
                        this.loading = false;
                        this.delivery.completed = true;
                      },
                      error: (error: HttpErrorResponse) => {
                        this.loading = false;
                        console.log(error);
                        // this.alertService.handleResponseErrorGeneric(error);
                      },
                      complete: () => {
                        this.loading = false;
                      }
                    });
                  }, 1000);
                }
              }
            });
          });
        }
      }
    });
  }
}
