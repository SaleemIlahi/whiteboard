import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Tool {
  id: string;
  name: string;
  icon: string;
}

export interface ToolbarState {
  selectedTool: string;
  isDrawing: boolean;
  tools: Tool[];
}

const tools: Tool[] = [
  { id: "hand", name: "hand", icon: "hand_grab" },
  { id: "pointer", name: "pointer", icon: "pointer" },
  { id: "square", name: "square", icon: "square" },
  { id: "diamond", name: "diamond", icon: "diamond" },
  { id: "circle", name: "circle", icon: "circle" },
  { id: "arrow", name: "arrow", icon: "arrow" },
  { id: "line", name: "line", icon: "line" },
  { id: "draw", name: "draw", icon: "draw" },
  { id: "text", name: "text", icon: "text" },
  { id: "image", name: "image", icon: "image" },
  { id: "eraser", name: "eraser", icon: "eraser" },
];

const initialState: ToolbarState = {
  selectedTool: "pointer",
  isDrawing: false,
  tools,
};

export const toolbarSlice = createSlice({
  name: "toolbar",
  initialState,
  reducers: {
    setActiveTool: (state, action: PayloadAction<string>) => {
      state.selectedTool = action.payload;
    },
    setIsDrawing: (state, action: PayloadAction<boolean>) => {
      state.isDrawing = action.payload;
    },
  },
});

export const { setActiveTool, setIsDrawing } = toolbarSlice.actions;
export default toolbarSlice.reducer;
