import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageInputComponent } from './message-input.component';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

describe('MessageInputComponent', () => {
  let component: MessageInputComponent;
  let fixture: ComponentFixture<MessageInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessageInputComponent],
    })
      .overrideComponent(MessageInputComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MessageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('output: send', () => {
    it('should emit form control value when submit button clicked', () => {
      const observerSpy = subscribeSpyTo(component.send);

      const testValue = 'hello';
      component.messageControl.setValue(testValue);

      const submit = fixture.debugElement.query(By.css('button'));
      submit.nativeElement.click();

      expect(observerSpy.getLastValue()).toEqual(testValue);
    });

    it('should clear form control when submitted', () => {
      component.messageControl.setValue('hello');

      const submit = fixture.debugElement.query(By.css('button'));
      submit.nativeElement.click();

      expect(component.messageControl.value).toEqual(null);
    });
  });
});
