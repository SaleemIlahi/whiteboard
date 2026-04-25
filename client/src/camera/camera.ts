import type { Point } from "./cordinates";
/**
 * Camera controls position (x, y) and zoom of the canvas.
 * It converts between world coordinates and screen coordinates.
 */
export class Camera {    
  public x:number = 0;
  public y:number = 0;
  public zoom:number = 1;

  // Convert world position → screen position
  worldToScreen(point: Point): Point {
    return {
      x: point.x * this.zoom + this.x,
      y: point.y * this.zoom + this.y,
    };
  }

  // Convert screen position → world position
  screenToWorld(point: Point): Point {
    return {
      x: (point.x - this.x) / this.zoom,
      y: (point.y - this.y) / this.zoom,
    };
  }

  // panPoint.x, panPoint.y are how many pixels to move horizontally and vertically
  pan(panPoint: Point) {
    this.x += panPoint.x;
    this.y += panPoint.y;
  }

  // Zooms in or out toward a specific screen point (e.g. mouse cursor)
  // Ensures the point under the cursor stays fixed after zooming
  zoomAt(screenPoint: Point, factor: number) {
    const MIN_ZOOM = 0.1;
    const MAX_ZOOM = 5;
    const pinned = this.screenToWorld(screenPoint);
    const zoomFactor = this.zoom * factor;
    if(zoomFactor < MIN_ZOOM || zoomFactor > MAX_ZOOM) return
    this.zoom = zoomFactor;
    this.x = screenPoint.x - pinned.x * this.zoom;
    this.y = screenPoint.y - pinned.y * this.zoom;
  }

  // Resets the camera to its default state
  reset() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
  }
}
