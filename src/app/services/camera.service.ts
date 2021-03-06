import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICamera } from '../interfaces/camera.interface';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  defaultAnswer = { x: 0, y: 0, z: 250 };

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  saveCameraPosition(camera: ICamera): Observable<true> {
    return this.http.post<ICamera>(`${ environment.apiUrl }/camera`, { camera }).pipe(
      map(() => true),
    );
  }

  readCameraPosition(): Observable<ICamera> {
    return this.http.get<ICamera>(`${ environment.apiUrl }/camera`).pipe(
      map(answer => {
        if (!answer) {
          return this.defaultAnswer;
        }
        return answer;
      }),
      catchError(() => {
        return of(this.defaultAnswer);
      }),
    );
  }
}
