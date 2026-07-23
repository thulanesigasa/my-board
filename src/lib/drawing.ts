import getStroke from 'perfect-freehand';
import { Point, BaseShape } from '@/types/board';

// Convert perfect-freehand outline points into SVG path string
export function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
}

// Generate freehand stroke path from points array
export function renderFreehandStroke(points: Point[], strokeWidth: number): string {
  const formattedPoints = points.map((p) => [p.x, p.y]);
  const stroke = getStroke(formattedPoints, {
    size: strokeWidth,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.55,
  });
  return getSvgPathFromStroke(stroke);
}

// Check if point (px, py) is inside shape bounds
export function isPointInShape(p: Point, shape: BaseShape): boolean {
  if (shape.type === 'freehand') {
    if (!shape.points || shape.points.length === 0) return false;
    const threshold = Math.max(10, shape.strokeWidth * 2);
    return shape.points.some((pt) => Math.hypot(pt.x - p.x, pt.y - p.y) <= threshold);
  }

  const minX = Math.min(shape.x, shape.x + (shape.width || 0));
  const maxX = Math.max(shape.x, shape.x + (shape.width || 0));
  const minY = Math.min(shape.y, shape.y + (shape.height || 0));
  const maxY = Math.max(shape.y, shape.y + (shape.height || 0));

  return p.x >= minX - 5 && p.x <= maxX + 5 && p.y >= minY - 5 && p.y <= maxY + 5;
}

// Calculate bounding box for a shape
export function getShapeBounds(shape: BaseShape) {
  if (shape.type === 'freehand' && shape.points && shape.points.length > 0) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    shape.points.forEach((pt) => {
      if (pt.x < minX) minX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y > maxY) maxY = pt.y;
    });
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  return {
    x: Math.min(shape.x, shape.x + (shape.width || 0)),
    y: Math.min(shape.y, shape.y + (shape.height || 0)),
    width: Math.abs(shape.width || 0),
    height: Math.abs(shape.height || 0),
  };
}
