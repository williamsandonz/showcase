import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { StripeCardElement } from '@stripe/stripe-js';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { StripeService } from '../../providers/stripe.service';
import { isControlInErrorState } from '../../../form';

@Component({
  selector: 'app-stripe-card',
  templateUrl: 'stripe-card.component.html',
  styleUrls: ['stripe-card.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StripeCardComponent),
      multi: true,
    },
    {
      provide: MatFormFieldControl,
      useExisting: StripeCardComponent,
    },
  ],
})
export class StripeCardComponent
  implements DoCheck, ControlValueAccessor, OnInit, AfterViewInit, MatFormFieldControl<any> {
  _value: any;
  card: StripeCardElement;
  controlType = 'stripe-card';
  errorState = false;
  focused: boolean;
  ngControl: NgControl;
  stateChanges = new Subject<void>();
  stripeElementId: string;
  touched: boolean;

  @Input() formControl: FormControl;
  @Input() submitted: boolean;

  @Output() cardElementReady = new EventEmitter<StripeCardElement>();

  static nextId = 0;
  @HostBinding() id = `stripe-card-${StripeCardComponent.nextId++}`;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(value) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  public _placeholder: string;

  @Input()
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  public _required = false;

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  public _disabled = false;

  get value(): any {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this.onChange(value);
    this.stateChanges.next();
  }

  get empty() {
    return true; //TODO
    //const commentText = this.editor.getText().trim();
    //return commentText ? false : true;
  }

  host: {
    '[id]': 'id';
    '[attr.aria-describedby]': 'describedBy';
  };

  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'div') {
      // this.container.nativeElement.querySelector('div').focus();
    }
  }

  constructor(public elRef: ElementRef, public injector: Injector, public stripeService: StripeService) {}

  ngOnInit() {
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.stripeElementId = `${this.id}-input`;
  }

  ngAfterViewInit() {
    this.stripeService.loaded.pipe(first()).subscribe(() => {
      const elements = this.stripeService.stripe.elements();
      this.card = elements.create('card', {
        // TODO whats happening here with colors?
        style: {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        },
      });
      this.card.mount(`#${this.stripeElementId}`);

      const defaultValidationMessage = 'Fill out all fields.';

      const control = this.ngControl.control;

      // Add initial error otherwise form is submittable before touch
      control.setErrors({ remote: defaultValidationMessage });

      this.card.on('focus' as any, (event) => {
        this.onTouched();
      });

      this.card.on('change', (event) => {
        if (!event.error && event.complete) {
          control.clearValidators();
          control.updateValueAndValidity();
          return;
        }
        // NB: If supporting multiple locales, you can pivot off event.error.code
        control.setErrors({
          remote: event.error ? event.error.message : defaultValidationMessage,
        });
      });

      this.cardElementReady.emit(this.card);
    });
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = isControlInErrorState(this.ngControl.control, this.submitted);
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  onChange = (delta: any) => {};

  onTouched = () => {
    this.touched = true;
  };

  writeValue() {}

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
}
