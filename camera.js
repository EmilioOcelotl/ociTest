// import * as params from './params';
import {isMobile} from './util';

export class Camera {
  constructor() {
    this.video = document.getElementById('video');
  }

  /**
   * Initiate a Camera instance and wait for the camera stream to be ready.
   * @param cameraParam From app `STATE.camera`.
   */
  static async setup(cameraParam) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
          'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    //const {targetFPS, sizeOption} = cameraParam;
  
    const videoConfig = {
      'audio': false,
      'video': {
        facingMode: 'user',
        // Only setting the video to a specified size for large screen, on
        // mobile devices accept the default size.
        width: isMobile() ? undefined : 640,
        height: isMobile() ? undefined : 480,
        frameRate: {
          ideal: 60,
        }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

    const camera = new Camera();
    camera.video.srcObject = stream;

    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(video);
      };
    });

    camera.video.play();

    const videoWidth = camera.video.videoWidth;
    const videoHeight = camera.video.videoHeight;
    // Must set below two lines, otherwise video element doesn't show.
    camera.video.width = videoWidth;
    camera.video.height = videoHeight;

    //const canvasContainer = document.querySelector('.canvas-wrapper');
    // canvasContainer.style = `width: ${videoWidth}px; height: ${videoHeight}px`;

    return camera;
  }
}
