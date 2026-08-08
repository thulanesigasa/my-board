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

// Export shapes as clean vector SVG file download
export function exportToSvg(shapes: BaseShape[], filename = 'whiteboard.svg') {
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080" style="background:#ffffff;">\n`;

  shapes.forEach((shape) => {
    const bounds = getShapeBounds(shape);
    if (shape.type === 'freehand' && shape.points) {
      const d = renderFreehandStroke(shape.points, shape.strokeWidth);
      svgContent += `  <path d="${d}" fill="${shape.strokeColor}" opacity="${shape.opacity ?? 1}" />\n`;
    } else if (shape.type === 'rectangle') {
      svgContent += `  <rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" stroke="${shape.strokeColor}" fill="${shape.fillColor || 'transparent'}" stroke-width="${shape.strokeWidth}" rx="6" />\n`;
    } else if (shape.type === 'circle') {
      const rx = bounds.width / 2;
      const ry = bounds.height / 2;
      svgContent += `  <ellipse cx="${bounds.x + rx}" cy="${bounds.y + ry}" rx="${rx}" ry="${ry}" stroke="${shape.strokeColor}" fill="${shape.fillColor || 'transparent'}" stroke-width="${shape.strokeWidth}" />\n`;
    } else if (shape.type === 'stickyNote') {
      svgContent += `  <rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" fill="${shape.fillColor || '#FEF08A'}" stroke="${shape.strokeColor || '#F97316'}" stroke-width="1.5" rx="12" />\n`;
      if (shape.text) {
        svgContent += `  <text x="${bounds.x + 12}" y="${bounds.y + 24}" fill="#0F172A" font-size="12" font-family="sans-serif">${shape.text}</text>\n`;
      }
    } else if (shape.type === 'text' && shape.text) {
      svgContent += `  <text x="${bounds.x}" y="${bounds.y + 20}" fill="${shape.strokeColor}" font-size="16" font-family="sans-serif" font-weight="bold">${shape.text}</text>\n`;
    }
  });

  svgContent += `</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Export shapes state snapshot as JSON file download
export function exportToJson(shapes: BaseShape[], filename = 'whiteboard-snapshot.json') {
  const jsonContent = JSON.stringify(shapes, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
