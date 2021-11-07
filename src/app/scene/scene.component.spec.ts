import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KEY_CODE, SceneComponent } from './scene.component';
import { CameraService } from '../services/camera.service';
import { of } from 'rxjs';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { ICamera } from '../interfaces/camera.interface';
import { cold, getTestScheduler } from 'jasmine-marbles';

describe('SceneComponent', () => {
  let component: SceneComponent;
  let fixture: ComponentFixture<SceneComponent>;

  const mockCameraService = {
    saveCameraPosition: jest.fn((_a: ICamera) => of({})),
    readCameraPosition: jest.fn(() => of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SceneComponent],
      providers: [
        { provide: CameraService, useValue: mockCameraService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('`set meshes` should assign meshes', () => {
    expect(component.meshArray.length).toEqual(0);
    component.meshes = [{
      geometry: new THREE.SphereGeometry(),
      material: new THREE.MeshLambertMaterial(),
      position: new Vector3(),
    }];
    expect(component.meshArray.length).toEqual(1);
  });

  it('`canvas` should return canvasRef nativeElement', () => {
    const nativeElement = { a: 1 } as any;
    component.canvasRef = { nativeElement };
    expect(component.canvas).toBe(nativeElement);
  });

  it('`ngOnDestroy` should unsubscribe sub', () => {
    const spy = jest.spyOn(component.sub$, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  describe('`ngOnInit`', () => {
    it('should add subscription', () => {
      const spy = jest.spyOn(component.sub$, 'add');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to changesPipe', () => {
      const subscribe = jest.fn();
      const spy = jest.spyOn(component, 'changesPipe').mockReturnValue({ subscribe } as any);
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should subscribe to readCameraPosition once', () => {
      const subscribe = jest.fn();
      mockCameraService.readCameraPosition.mockReturnValue({ subscribe } as any);
      component.ngOnInit();
      expect(mockCameraService.readCameraPosition).toHaveBeenCalled();
    });

    it('should set camera position read from server', () => {
      const value = { x: 1, y: 2, z: 3 };
      const set = jest.fn();
      component.camera = { position: { set } } as any;
      mockCameraService.readCameraPosition.mockReturnValue(of(value));
      component.ngOnInit();
      expect(set).toHaveBeenCalledWith(1, 2, 3);
    });
  });

  describe('`changesPipe`', () => {
    it('should emit a value in 600ms', () => {
      const vector = new THREE.Vector3(0, 0, 0);
      // @ts-ignore
      component.changes = cold('c', { c: vector });

      const scheduler = getTestScheduler();
      scheduler.run(() => {
        const expected$ = cold('600ms c', { c: {} });
        expect(component.changesPipe()).toBeObservable(expected$);
      });

    });

    it('should emit a value in 200 + 300 + 600 + 10 ms with debounce', () => {
      const vector = new THREE.Vector3(0, 0, 0);
      // @ts-ignore
      component.changes = cold('200ms c 300ms c', { c: vector });

      const scheduler = getTestScheduler();
      scheduler.run(() => {
        const expected$ = cold('1110ms c', { c: {} });
        expect(component.changesPipe()).toBeObservable(expected$);
      });
    });
  });

  describe('`keyEvent`', () => {
    const translateY = jest.fn();
    const translateX = jest.fn();
    const preventDefault = jest.fn();

    it('should call camera.translateY(-0.3) if UP_ARROW', () => {
      const event = { key: KEY_CODE.UP_ARROW, preventDefault } as any;
      component.camera = { translateY } as any;

      component.keyEvent(event);

      expect(translateY).toHaveBeenCalledWith(-0.3);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should call camera.translateY(0.3) if DOWN_ARROW', () => {
      const event = { key: KEY_CODE.DOWN_ARROW, preventDefault } as any;
      component.camera = { translateY } as any;

      component.keyEvent(event);

      expect(translateY).toHaveBeenCalledWith(0.3);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should call camera.translateX(0.3) if LEFT_ARROW', () => {
      const event = { key: KEY_CODE.LEFT_ARROW, preventDefault } as any;
      component.camera = { translateX } as any;

      component.keyEvent(event);

      expect(translateX).toHaveBeenCalledWith(0.3);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should call camera.translateX(-0.3) if RIGHT_ARROW', () => {
      const event = { key: KEY_CODE.RIGHT_ARROW, preventDefault } as any;
      component.camera = { translateX } as any;

      component.keyEvent(event);

      expect(translateX).toHaveBeenCalledWith(-0.3);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should do nothing if another key pressed', () => {
      const event = { key: 'f11', preventDefault } as any;
      component.keyEvent(event);

      expect(translateX).not.toHaveBeenCalled();
      expect(translateY).not.toHaveBeenCalled();
      expect(preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('`wheelEvent`', () => {
    const translateZ = jest.fn();
    const preventDefault = jest.fn();

    it('should call camera.translateZ(10) if rotate backward', () => {
      const event = { deltaY: 50, preventDefault } as any;
      component.camera = { translateZ } as any;

      component.wheelEvent(event);

      expect(translateZ).toHaveBeenCalledWith(10);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should call camera.translateZ(-10) if rotate forward', () => {
      const event = { deltaY: -50, preventDefault } as any;
      component.camera = { translateZ } as any;

      component.wheelEvent(event);

      expect(translateZ).toHaveBeenCalledWith(-10);
      expect(preventDefault).toHaveBeenCalled();
    });
  });

  it('`ngAfterViewInit` should createScene and startRenderingLoop', () => {
    const spy1 = jest.spyOn(component, 'createScene').mockImplementation(jest.fn());
    const spy2 = jest.spyOn(component, 'startRenderingLoop').mockImplementation(jest.fn());

    component.ngAfterViewInit();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('`getAspectRatio` should return screen aspect ratio', () => {
    jest.spyOn(component, 'canvas', 'get').mockReturnValue({ clientWidth: 500, clientHeight: 100 } as any);
    expect(component.getAspectRatio()).toEqual(5);
  });

  it('`createScene` should create camera and scene (here we can check any camera or scene attributes)', () => {
    expect(component.camera).toBeUndefined();
    expect(component.canvas).toBeUndefined();
    component.meshes = [{
      geometry: new THREE.SphereGeometry(),
      material: new THREE.MeshLambertMaterial(),
      position: new Vector3(0, 0, 0),
    }];
    jest.spyOn(component, 'canvas', 'get').mockReturnValue({ clientWidth: 500, clientHeight: 100 } as any);
    component.createScene();
    expect(component.camera).toBeDefined();
    expect(component.scene).toBeDefined();
    expect(component.scene.children.length).toEqual(2);
    expect(component.scene.children[0]).toEqual(expect.any(THREE.Mesh));
    expect(component.scene.children[1]).toEqual(expect.any(THREE.PerspectiveCamera));
  });

  it('`startRenderingLoop` should ', () => {
    const setPixelRatio = jest.fn();
    const setSize = jest.fn();
    const render = jest.fn();
    component.scene = { a: 1 } as any;
    component.camera = { b: 2 } as any;
    jest.spyOn(component, 'canvas', 'get').mockReturnValue({ clientWidth: 500, clientHeight: 100 } as any);
    jest.spyOn(component, 'composeRenderer').mockReturnValue({ setPixelRatio, setSize, render } as any);

    component.startRenderingLoop();

    expect(setPixelRatio).toHaveBeenCalledWith(devicePixelRatio);
    expect(setSize).toHaveBeenCalledWith(component.canvas.clientWidth, component.canvas.clientHeight);
    expect(render).toHaveBeenCalledWith(component.scene, component.camera);
  });

});
