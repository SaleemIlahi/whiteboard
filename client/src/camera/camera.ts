import type { Point } from "./cordinates";
/**
 * Camera controls position (x, y) and zoom of the canvas.
 * It converts between world coordinates and screen coordinates.
 */
export class Camera {
  x = 0;
  y = 0;
  zoom = 1;

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
}
