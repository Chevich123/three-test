import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { CameraService } from './camera.service';
import { environment } from '../../environments/environment';

describe('CameraService', () => {
  let service: CameraService;
  let httpClient: HttpClient;
  const data = { x: 1, y: 2, z: 3 };
  const fakeHttpClient = {
    get: () => {
    },
    post: () => {
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CameraService,
        { provide: HttpClient, useValue: fakeHttpClient },
      ],
    });
    service = TestBed.inject(CameraService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('`saveCameraPosition` should call http.post with correct path', (done) => {
    const returnValue = { id: '1' } as any;
    const spy = spyOn(httpClient, 'post').and.returnValue(of(returnValue));
    const answer = service.saveCameraPosition(data);
    expect(answer).toEqual(jasmine.any(Observable));
    expect(spy).toHaveBeenCalledWith(`${ environment.apiUrl }/camera`, { camera: data });
    answer.subscribe(value => {
      expect(value).toEqual(true);
      done();
    });
  });

  describe('`readCameraPosition` ', () => {
    it('should call http.get with correct path and return exact data if exists', (done) => {
      const returnValue = { id: '1' } as any;
      const spy = spyOn(httpClient, 'get').and.returnValue(of(returnValue));
      const answer = service.readCameraPosition();
      expect(answer).toEqual(jasmine.any(Observable));
      expect(spy).toHaveBeenCalledWith(`${ environment.apiUrl }/camera`);
      answer.subscribe(value => {
        expect(value).toEqual(returnValue);
        done();
      });
    });

    it('should call http.get with correct path and return defaultData if answer is empty', (done) => {
      spyOn(httpClient, 'get').and.returnValue(of(null));
      const answer = service.readCameraPosition();
      expect(answer).toEqual(jasmine.any(Observable));
      answer.subscribe(value => {
        expect(value).toEqual(service.defaultAnswer);
        done();
      });
    });

    it('should call http.get with correct path and return defaultData if error', (done) => {
      spyOn(httpClient, 'get').and.returnValue(throwError({ status: 404 }));
      const answer = service.readCameraPosition();
      expect(answer).toEqual(jasmine.any(Observable));
      answer.subscribe(value => {
        expect(value).toEqual(service.defaultAnswer);
        done();
      });
    });
  });
});
