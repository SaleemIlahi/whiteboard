import type { Shape } from "./shape";

export class Scene {
    shapes: Map<number,Shape> = new Map();

    addShapes(shape:Shape){
        this.shapes.set(shape.id,shape)
    }

    getAllShapes(){
        return Array.from(this.shapes.values())
    }
}