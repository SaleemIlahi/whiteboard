export const layers = {
  grid: null as HTMLCanvasElement | null,
  shapes: null as HTMLCanvasElement | null,
  interaction: null as HTMLCanvasElement | null,
};

export type CameraPos = {
  x: number;
  y: number;
  zoom: number;
};
