import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { CameraService } from './camera.service';
import { environment } from '../../environments/environment';
import { cold } from 'jasmine-marbles';

describe('CameraService', () => {
  let service: CameraService;
  let httpClient: HttpClient;
  const data = { x: 1, y: 2, z: 3 };
  const mockHttpClient = {
    get: () => {
    },
    post: () => {
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CameraService,
        { provide: HttpClient, useValue: mockHttpClient },
      ],
    });
    service = TestBed.inject(CameraService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('`saveCameraPosition` should call http.post with correct path', () => {
    const returnValue = { id: '1' } as any;
    const spy = jest.spyOn(httpClient, 'post').mockReturnValue(of(returnValue));
    const expected$ = cold('(c|)', { c: true });

    expect(service.saveCameraPosition(data)).toBeObservable(expected$);

    expect(spy).toHaveBeenCalledWith(`${ environment.apiUrl }/camera`, { camera: data });
  });

  describe('`readCameraPosition` ', () => {
    it('should call http.get with correct path and return exact data if exists', () => {
      const returnValue = { id: '1' } as any;
      const spy = jest.spyOn(httpClient, 'get').mockReturnValue(of(returnValue));
      const expected$ = cold('(c|)', { c: returnValue });

      expect(service.readCameraPosition()).toBeObservable(expected$);

      expect(spy).toHaveBeenCalledWith(`${ environment.apiUrl }/camera`);
    });

    it('should call http.get with correct path and return exact data if answer is empty', () => {
      const spy = jest.spyOn(httpClient, 'get').mockReturnValue(of(null));
      const expected$ = cold('(c|)', { c: service.defaultAnswer });

      expect(service.readCameraPosition()).toBeObservable(expected$);

      expect(spy).toHaveBeenCalledWith(`${ environment.apiUrl }/camera`);
    });

    it('should call http.get with correct path and return defaultData if error', () => {
      const spy = jest.spyOn(httpClient, 'get').mockReturnValue(cold('#', {}, Error('Some')));
      const expected$ = cold('(c|)', { c: service.defaultAnswer });

      expect(service.readCameraPosition()).toBeObservable(expected$);

      expect(spy).toHaveBeenCalledWith(`${ environment.apiUrl }/camera`);
    });
  });
});
