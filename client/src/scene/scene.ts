import type { Shape } from "./shape";
/**
 * Scene stores all shapes (like rectangles, lines, etc).
 * It uses a Map to quickly add, update, and get shapes.
 */
export class Scene {
  shapes: Map<number, Shape> = new Map();

  addShapes(shape: Shape) {
    this.shapes.set(shape.id, shape);
  }

  getAllShapes() {
    return Array.from(this.shapes.values());
  }
}
