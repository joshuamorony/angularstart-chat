import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageListComponent } from './message-list.component';
import { By } from '@angular/platform-browser';

describe('MessageListComponent', () => {
  let component: MessageListComponent;
  let fixture: ComponentFixture<MessageListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessageListComponent],
    })
      .overrideComponent(MessageListComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MessageListComponent);
    component = fixture.componentInstance;
    component.messages = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('input: messages', () => {
    it('should render an item for each message', () => {
      const testMessages = [{}, {}, {}] as any;
      component.messages = testMessages;

      fixture.detectChanges();

      const messages = fixture.debugElement.queryAll(
        By.css('[data-testid="message"]')
      );

      expect(messages.length).toEqual(testMessages.length);
    });
  });
});
