import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from './home.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MessageService } from '../shared/data-access/message.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let messageService: MessageService;

  const mockMessages = [{}, {}];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: MessageService,
          useValue: {
            add$: {
              next: jest.fn(),
            },
            messages: jest.fn().mockReturnValue(mockMessages),
          },
        },
      ],
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [] },
        add: { imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('app-message-list', () => {
    let messageList: DebugElement;

    beforeEach(() => {
      messageList = fixture.debugElement.query(By.css('app-message-list'));
    });

    it('should use messages selector as input', () => {
      expect(messageList.componentInstance.messages).toEqual(mockMessages);
    });
  });

  describe('app-message-input', () => {
    let messageInput: DebugElement;

    beforeEach(() => {
      messageInput = fixture.debugElement.query(By.css('app-message-input'));
    });

    describe('output: send', () => {
      it('should next the add$ source on the message service with value', () => {
        const testValue = 'hello';
        messageInput.triggerEventHandler('send', testValue);

        expect(messageService.add$.next).toHaveBeenCalledWith(testValue);
      });
    });
  });
});
