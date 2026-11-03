import React, { useRef, useState, useEffect } from 'react';
import { StudioElement, TextElement, ShapeElement, DividerElement, ImageElement } from '../types/studio';

interface StudioElementRendererProps {
  element: StudioElement;
  isSelected: boolean;
  zoom: number;
  onSelect: (e: React.PointerEvent, element: StudioElement) => void;
  onUpdate: (updated: StudioElement) => void;
  onStartDrag: (e: React.PointerEvent, element: StudioElement) => void;
  onStartResize: (e: React.PointerEvent, element: StudioElement, handle: string) => void;
}

export const StudioElementRenderer: React.FC<StudioElementRendererProps> = ({
  element,
  isSelected,
  zoom,
  onSelect,
  onUpdate,
  onStartDrag,
  onStartResize
}) => {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [localText, setLocalText] = useState(element.type === 'text' ? element.text : '');

  useEffect(() => {
    if (element.type === 'text') {
      setLocalText(element.text);
    }
  }, [element]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent background canvas deselect
    e.stopPropagation();
    onSelect(e, element);
    if (!element.isLocked && !isInlineEditing) {
      onStartDrag(e, element);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type === 'text' && !element.isLocked) {
      e.stopPropagation();
      setIsInlineEditing(true);
    }
  };

  const handleBlurText = () => {
    setIsInlineEditing(false);
    if (element.type === 'text' && localText !== element.text) {
      onUpdate({
        ...element,
        text: localText
      });
    }
  };

  // Base container style
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    zIndex: element.zIndex,
    opacity: element.opacity !== undefined ? element.opacity : 1,
    cursor: element.isLocked ? 'default' : isInlineEditing ? 'text' : 'move',
    userSelect: isInlineEditing ? 'text' : 'none',
    touchAction: 'none'
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text': {
        const textEl = element as TextElement;
        const fontClass =
          textEl.fontFamily === 'Merriweather'
            ? 'font-merriweather'
            : textEl.fontFamily === 'Plus Jakarta Sans'
            ? 'font-jakarta'
            : textEl.fontFamily === 'Space Grotesk'
            ? 'font-grotesk'
            : textEl.fontFamily === 'Cinzel'
            ? 'font-cinzel'
            : 'font-inter';

        const weightClass =
          textEl.fontWeight === 'extrabold'
            ? 'font-extrabold'
            : textEl.fontWeight === 'bold'
            ? 'font-bold'
            : textEl.fontWeight === 'semibold'
            ? 'font-semibold'
            : textEl.fontWeight === 'medium'
            ? 'font-medium'
            : 'font-normal';

        if (isInlineEditing) {
          return (
            <textarea
              autoFocus
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              onBlur={handleBlurText}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleBlurText();
              }}
              style={{
                fontSize: `${textEl.fontSize}px`,
                color: textEl.color,
                textAlign: textEl.textAlign,
                fontStyle: textEl.fontStyle,
                lineHeight: textEl.lineHeight || 1.3
              }}
              className={`w-full h-full p-0 bg-transparent resize-none border-none outline-hidden ${fontClass} ${weightClass}`}
            />
          );
        }

        return (
          <div
            style={{
              fontSize: `${textEl.fontSize}px`,
              color: textEl.color,
              textAlign: textEl.textAlign,
              fontStyle: textEl.fontStyle,
              lineHeight: textEl.lineHeight || 1.3,
              backgroundColor: textEl.backgroundColor,
              borderRadius: textEl.borderRadius ? `${textEl.borderRadius}px` : undefined,
              padding: textEl.padding ? `${textEl.padding}px` : undefined
            }}
            className={`w-full h-full overflow-hidden whitespace-pre-wrap break-words ${fontClass} ${weightClass}`}
          >
            {textEl.text}
          </div>
        );
      }

      case 'shape': {
        const shapeEl = element as ShapeElement;
        const isCircle = shapeEl.shapeType === 'circle';
        return (
          <div
            style={{
              backgroundColor: shapeEl.fillColor,
              borderColor: shapeEl.borderColor,
              borderWidth: shapeEl.borderWidth ? `${shapeEl.borderWidth}px` : undefined,
              borderStyle: shapeEl.borderWidth ? 'solid' : undefined,
              borderRadius: isCircle ? '50%' : shapeEl.borderRadius ? `${shapeEl.borderRadius}px` : '0px'
            }}
            className="w-full h-full"
          />
        );
      }

      case 'divider': {
        const divEl = element as DividerElement;
        return (
          <div className="w-full h-full flex items-center">
            <div
              style={{
                width: '100%',
                height: `${divEl.thickness}px`,
                backgroundColor: divEl.style === 'solid' ? divEl.color : 'transparent',
                borderTop: divEl.style !== 'solid' ? `${divEl.thickness}px ${divEl.style} ${divEl.color}` : undefined
              }}
            />
          </div>
        );
      }

      case 'image': {
        const imgEl = element as ImageElement;
        const shape = imgEl.shape || (imgEl.borderRadius && imgEl.borderRadius >= 50 ? 'circle' : 'rectangle');

        let shapeRadius: string | undefined = undefined;
        let clipPath: string | undefined = undefined;

        if (shape === 'circle') {
          shapeRadius = '9999px';
        } else if (shape === 'rounded') {
          shapeRadius = imgEl.borderRadius ? `${imgEl.borderRadius}px` : '18px';
        } else if (shape === 'oval') {
          shapeRadius = '50% / 40%';
        } else if (shape === 'hexagon') {
          clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        } else if (shape === 'badge') {
          clipPath = 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)';
        } else {
          shapeRadius = imgEl.borderRadius ? `${imgEl.borderRadius}px` : '0px';
        }

        return (
          <div
            className="w-full h-full overflow-hidden flex items-center justify-center select-none"
            style={{
              borderRadius: shapeRadius,
              clipPath,
              WebkitClipPath: clipPath,
              borderColor: imgEl.borderColor,
              borderWidth: imgEl.borderWidth ? `${imgEl.borderWidth}px` : undefined,
              borderStyle: imgEl.borderWidth ? (imgEl.borderStyle || 'solid') : undefined
            }}
          >
            <img
              src={imgEl.src}
              alt="canvas graphic"
              draggable={false}
              style={{
                objectFit: imgEl.objectFit || 'cover'
              }}
              className="w-full h-full pointer-events-none select-none"
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Resize handle helper
  const renderHandle = (handle: string, posClass: string, cursorClass: string) => (
    <div
      onPointerDown={(e) => {
        e.stopPropagation();
        onStartResize(e, element, handle);
      }}
      className={`absolute w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-full shadow-xs ${posClass} ${cursorClass} z-30 transition-transform hover:scale-125`}
      style={{
        // Touch target expansion for mobile without visually altering the handle
        margin: '-7px'
      }}
    />
  );

  return (
    <div
      style={containerStyle}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      className={`group ${isSelected ? 'ring-2 ring-blue-600' : 'hover:ring-1 hover:ring-blue-400/60'}`}
    >
      {renderContent()}

      {/* Selection outline and 8 resize handles */}
      {isSelected && !element.isLocked && !isInlineEditing && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-Left */}
          <div className="pointer-events-auto">{renderHandle('nw', 'top-0 left-0', 'cursor-nwse-resize')}</div>
          {/* Top-Center */}
          <div className="pointer-events-auto">{renderHandle('n', 'top-0 left-1/2', 'cursor-ns-resize')}</div>
          {/* Top-Right */}
          <div className="pointer-events-auto">{renderHandle('ne', 'top-0 right-0', 'cursor-nesw-resize')}</div>
          {/* Middle-Right */}
          <div className="pointer-events-auto">{renderHandle('e', 'top-1/2 right-0', 'cursor-ew-resize')}</div>
          {/* Bottom-Right */}
          <div className="pointer-events-auto">{renderHandle('se', 'bottom-0 right-0', 'cursor-nwse-resize')}</div>
          {/* Bottom-Center */}
          <div className="pointer-events-auto">{renderHandle('s', 'bottom-0 left-1/2', 'cursor-ns-resize')}</div>
          {/* Bottom-Left */}
          <div className="pointer-events-auto">{renderHandle('sw', 'bottom-0 left-0', 'cursor-nesw-resize')}</div>
          {/* Middle-Left */}
          <div className="pointer-events-auto">{renderHandle('w', 'top-1/2 left-0', 'cursor-ew-resize')}</div>
        </div>
      )}
    </div>
  );
};
