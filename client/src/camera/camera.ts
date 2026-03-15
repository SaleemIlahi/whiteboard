import type { Point } from "./cordinates";

export class camera {
  x = 0;
  y = 0;
  zoom = 1;

  worldToScreen(point: Point): Point {
    return {
      x: point.x * this.zoom + this.x,
      y: point.y * this.zoom + this.y,
    };
  }

  screenToWorld(point: Point): Point {
    return {
      x: (point.x - this.x) / this.zoom,
      y: (point.y - this.y) / this.zoom,
    };
  }
}
