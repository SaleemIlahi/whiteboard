import { useEffect, useRef } from "react";
import { layers } from "./layers";
import S from "../styles/canvas.module.scss";
import { Camera } from "../camera/camera";
import { Scene } from "../scene/scene";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { DrawShapes } from "./renderer";
import { setIsDrawing } from "../features/toolbar/toolbarSlice";

const camera = new Camera();
const scene = new Scene();
const drawCanvaShape = new DrawShapes();

export const CanvasRoot = () => {
  const activeToolBar = useSelector(
    (state: RootState) => state.toolbar.selectedTool
  );
  const drawCanvasActive = useSelector(
    (state: RootState) => state.toolbar.isDrawing
  );
  const gridRef = useRef<HTMLCanvasElement | null>(null);
  const shapesRef = useRef<HTMLCanvasElement | null>(null);
  const interactionRef = useRef<HTMLCanvasElement | null>(null);
  const activeToolBarRef = useRef(activeToolBar);
  const drawCanvasActiveRef = useRef(drawCanvasActive);
  const dispatch = useDispatch();

  const cursorMap: Record<string, string> = {
    hand: "grab",
    pointer: "default",
    square: "crosshair",
    diamond: "crosshair",
    circle: "crosshair",
    arrow: "crosshair",
    line: "crosshair",
    draw: "crosshair",
    text: "text",
    image: "copy",
    eraser: "not-allowed",
  };

  useEffect(() => {
    activeToolBarRef.current = activeToolBar;
    const cursor = cursorMap[activeToolBar] || "default";
    if (interactionRef.current) {
      interactionRef.current.style.cursor = cursor;
    }
  }, [activeToolBar]);

  useEffect(() => {
    drawCanvasActiveRef.current = drawCanvasActive;
  }, [drawCanvasActiveRef]);

  const drawAll = () => {
    const shapes = scene.getAllShapes();

    drawCanvaShape.draw(
      shapes,
      {
        x: camera.x,
        y: camera.y,
        zoom: camera.zoom,
      },
      gridRef.current,
      shapesRef.current,
      interactionRef.current
    );
  };

  useEffect(() => {
    layers.grid = gridRef.current;
    layers.shapes = shapesRef.current;
    layers.interaction = interactionRef.current;
    const interactionCanvas = interactionRef.current;
    if (!interactionCanvas) return;

    // Set canvas size to match screen BEFORE any drawing or interaction
    const handleResize = () => {
      resizeAll();
      drawAll();
    };

    // Handle zoom (mouse wheel)
    const handleWheel = (e: WheelEvent) => {
      mouseWheel(e);
      drawAll();
    };

    // Handle mouse down (start drawing or panning)
    const handleMouseDown = (e: MouseEvent) => {
      // convert x,y cordinates to wrold view
      const { x, y } = camera.screenToWorld({ x: e.clientX, y: e.clientY });
      const startPosX = x;
      const startPosY = y;
      let shapeWidth = 0;
      let shapeHeight = 0;

      // Generate unique shape id
      const shapeId = Math.floor(Math.random() * 90000000) + 10000000;

      // Enable drawing mode if not hand/pointer tool
      if (
        activeToolBarRef.current !== "hand" &&
        activeToolBarRef.current !== "pointer"
      ) {
        dispatch(setIsDrawing(true));
      }

      // Handle mouse move (dragging)
      const handleMouseMove = (e: MouseEvent) => {
        if (activeToolBarRef.current === "hand") {
          mouseMove(e);
        } else if (activeToolBarRef.current === "square") {
          // convert x,y cordinates to wrold view
          const { x, y } = camera.screenToWorld({
            x: e.clientX,
            y: e.clientY,
          });
          const endPosX = x;
          const endPosY = y;
          shapeWidth = endPosX - startPosX;
          shapeHeight = endPosY - startPosY;
          scene.addShapes({
            id: shapeId,
            w: shapeWidth,
            h: shapeHeight,
            x: startPosX,
            y: startPosY,
            type: "square",
            strokeColor: "#000",
            strokeWidth: 3,
            fillColor: "transparent",
            round: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
          });

          drawAll();
        }
      };

      // Handle mouse up (finish drawing)
      const handleMouseUp = () => {
        dispatch(setIsDrawing(false));
        window.removeEventListener("mousemove", handleMouseMove);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp, { once: true });
    };

    window.addEventListener("resize", handleResize);
    interactionCanvas.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    interactionCanvas.addEventListener("mousedown", handleMouseDown);

    // Cleanup: remove all listeners to avoid memory leaks
    return () => {
      window.removeEventListener("resize", handleResize);
      interactionCanvas.removeEventListener("wheel", handleWheel);
      interactionCanvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div className={S.canvas_cnt}>
      <canvas ref={gridRef} className={S.canvas_style} />
      <canvas ref={shapesRef} className={S.canvas_style} />
      <canvas ref={interactionRef} className={S.canvas_style} />
    </div>
  );
};

/*
  Part of canvas engine logic (not React UI logic).
  Independent of React state/props, so defined outside
  to keep it reusable and avoid re-creation on re-renders.
*/
const resizeAll = () => {
  Object.values(layers).forEach((canvas) => {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
};

const mouseMove = (e: MouseEvent) => {
  camera.pan({ x: e.movementX, y: e.movementY });
};

const mouseWheel = (e: WheelEvent) => {
  e.preventDefault();
  const isPinch = e.ctrlKey;
  if (isPinch) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    camera.zoomAt({ x: e.clientX, y: e.clientY }, factor);
  } else {
    camera.pan({ x: -e.deltaX, y: -e.deltaY });
  }
};
