import type { Shape } from "../scene/shape";
import type { CameraPos } from "./layers.ts";

export class DrawShapes {
  private ctxGrid: CanvasRenderingContext2D | null = null;
  private ctxInteraction: CanvasRenderingContext2D | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private drawRect(shape: Shape) {
    if (!this.ctx) return;

    // rect style
    this.ctx.lineWidth = shape.strokeWidth;
    this.ctx.strokeStyle = shape.strokeColor;

    // fill color if not transparent
    if (shape.fillColor !== "transparent") {
      this.ctx.fillStyle = shape.fillColor;
    }

    // for rounded corner
    if (shape.round) {
      this.ctx.beginPath();
      this.ctx.roundRect(shape.x, shape.y, shape.w, shape.h, 20);
      this.ctx.stroke();
    } else {
      this.ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
    }
  }

  draw(
    shapes: Shape[],
    camera: CameraPos,
    grid: HTMLCanvasElement | null,
    canvas: HTMLCanvasElement | null,
    interaction: HTMLCanvasElement | null
  ) {
    if (!canvas || !grid || !interaction) return;

    this.ctx = canvas?.getContext("2d");
    this.ctxGrid = grid?.getContext("2d");
    this.ctxInteraction = interaction?.getContext("2d");

    if (!this.ctx) return;

    // clear canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // save clean state
    this.ctx.save();

    // Device Pixel Ratio (for sharp rendering on retina screens)
    const dpr = window.devicePixelRatio || 1;

    // Get CSS size (visible size)
    const shapeCanvas = canvas.getBoundingClientRect();
    const gridCanvas = grid.getBoundingClientRect();
    const interactionCanvas = interaction.getBoundingClientRect();

    // Reset canvas size
    canvas.width = shapeCanvas.width * dpr;
    canvas.height = shapeCanvas.height * dpr;

    grid.width = gridCanvas.width * dpr;
    grid.height = gridCanvas.height * dpr;

    interaction.width = interactionCanvas.width * dpr;
    interaction.height = interactionCanvas.height * dpr;

    // ✅ 3. apply transform (camera + DPR together)
    this.ctx.setTransform(
      camera.zoom * dpr,
      0,
      0,
      camera.zoom * dpr,
      camera.x * dpr,
      camera.y * dpr
    );

    if (this.ctxGrid)
      this.ctxGrid.setTransform(
        camera.zoom * dpr,
        0,
        0,
        camera.zoom * dpr,
        camera.x * dpr,
        camera.y * dpr
      );

    if (this.ctxInteraction)
      this.ctxInteraction.setTransform(
        camera.zoom * dpr,
        0,
        0,
        camera.zoom * dpr,
        camera.x * dpr,
        camera.y * dpr
      );

    // draw everything
    shapes.forEach((shape) => {
      if (shape.type === "square") {
        this.drawRect(shape);
      }
    });

    // 5. restore canvas state
    this.ctx.restore();
  }
}
