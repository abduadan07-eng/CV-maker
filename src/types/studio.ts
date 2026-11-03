/**
 * Type definitions for CV Maker Phase 2: Canva-Style Design Studio
 */

export type ElementType = 'text' | 'shape' | 'image' | 'divider';

export type ShapeType = 'rectangle' | 'circle' | 'rounded-rectangle' | 'badge';

export type TextRole = 'heading' | 'subheading' | 'body' | 'caption';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number; // In A4 pixel coordinates (base width: 794px)
  y: number; // In A4 pixel coordinates (base height: 1123px)
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  isLocked?: boolean;
  opacity?: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  role?: TextRole;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  lineHeight?: number;
  letterSpacing?: number;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fillColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  color: string;
  thickness: number;
  style: 'solid' | 'dashed' | 'dotted';
}

export type ImageShape = 'rectangle' | 'circle' | 'rounded' | 'oval' | 'hexagon' | 'badge';

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  shape?: ImageShape;
  borderRadius?: number;
  objectFit?: 'cover' | 'contain';
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'double';
}

export type StudioElement = TextElement | ShapeElement | DividerElement | ImageElement;

export interface StudioPage {
  id: string;
  pageNumber: number;
  backgroundColor: string;
  elements: StudioElement[];
}

export interface StudioDocument {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pages: StudioPage[];
  width: number;  // Default 794 (A4 at 96 DPI)
  height: number; // Default 1123 (A4 at 96 DPI)
  sourceTemplateId?: string;
  sourceCvDraftId?: string;
}

export type StudioToolTab = 'templates' | 'text' | 'elements' | 'blocks' | 'uploads' | 'pages';
