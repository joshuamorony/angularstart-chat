import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

const mockCollectionReference = jest.fn();
const mockCollection = jest
  .fn()
  .mockReturnValue(mockCollectionReference as any);
const mockAddDoc = jest.fn();

jest.mock('@angular/fire/firestore', () => ({
  collection: mockCollection,
  addDoc: mockAddDoc,
}));

describe('MessageService', () => {
  let service: MessageService;

  const testUser = {
    email: '',
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }],
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

    it('should create a new document in the messages collection using the supplied message and authenticated user as author', () => {
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
