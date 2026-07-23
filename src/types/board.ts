export type ToolType =
  | 'select'
  | 'pencil'
  | 'highlighter'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'text'
  | 'stickyNote'
  | 'eraser';

export interface Point {
  x: number;
  y: number;
}

export type ShapeType = 'freehand' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text' | 'stickyNote';

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  opacity?: number;
  text?: string;
  points?: Point[];
  updatedAt: number;
  createdBy: string;
  zIndex: number;
}

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  cursor: Point | null;
  selectedShapeIds: string[];
  activeTool?: ToolType;
  lastSeen: number;
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}
