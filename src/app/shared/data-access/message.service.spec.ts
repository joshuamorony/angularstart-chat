import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';

xdescribe('MessageService', () => {
  let service: MessageService;

  const mockCollectionReference = jest.fn();
  const mockCollection = jest
    .fn()
    .mockReturnValue(mockCollectionReference as any);
  const mockAddDoc = jest.fn();

  const testUser = {
    email: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
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

    xit('should create a new document in the messages collection using the supplied message and authenticated user as author', async () => {
      const testMessage = {
        author: '',
        content: 'test',
      };

      service.add$.next(testMessage.content);

      expect(mockCollection).toHaveBeenCalledWith({} as any, 'messages');
      expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionReference as any, {
        ...testMessage,
        created: Date.now().toString(),
      });
    });
  });
});
