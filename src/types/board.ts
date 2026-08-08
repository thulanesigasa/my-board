export type ToolType =
  | 'select'
  | 'pencil'
  | 'highlighter'
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 'triangle'
  | 'star'
  | 'line'
  | 'arrow'
  | 'text'
  | 'stickyNote'
  | 'eraser'
  | 'prototype'
  | 'diagram'
  | 'table'
  | 'timeline'
  | 'kanban'
  | 'doc'
  | 'slides'
  | 'engage'
  | 'talktrack';

export interface Point {
  x: number;
  y: number;
}

export type ShapeType =
  | 'freehand'
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 'triangle'
  | 'star'
  | 'line'
  | 'arrow'
  | 'text'
  | 'stickyNote'
  | 'prototype'
  | 'diagram'
  | 'table'
  | 'timeline'
  | 'kanban'
  | 'doc'
  | 'slides'
  | 'engage'
  | 'talktrack';

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
  // Widget-specific data payload
  widgetData?: Record<string, unknown>;
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
