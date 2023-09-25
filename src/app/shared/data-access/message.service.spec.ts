import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService],
    });

    service = TestBed.inject(MessageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('source: add$', () => {
    beforeEach(() => {
      Date.now = jest.fn(() => 1);
    });

    it('should cause the message to be added to the messages state', () => {
      const testMessage = 'hello';
      service.add$.next(testMessage);

      const messages = service.messages();

      expect(messages[messages.length - 1]).toEqual({
        author: '',
        content: testMessage,
        created: Date.now().toString(),
      });
    });
  });
});
