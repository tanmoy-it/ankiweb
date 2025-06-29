import React, { useState, useRef, useEffect, ReactNode } from 'react';
import './DraggableWindow.css';

interface DraggableWindowProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

interface Position {
    x: number;
    y: number;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({ 
    isOpen, 
    onClose, 
    title = "Window", 
    children 
}) => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const windowRef = useRef<HTMLDivElement>(null);

    // Enhanced window opening animation
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 50);
            if (windowRef.current) {
                const rect = windowRef.current.getBoundingClientRect();
                const centerX = (window.innerWidth - rect.width) / 2;
                const centerY = (window.innerHeight - rect.height) / 2;
                setPosition({ x: centerX, y: centerY });
            }
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('.window-controls')) return;
        
        setIsDragging(true);
        const rect = windowRef.current!.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        
        // Add subtle haptic feedback simulation
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !windowRef.current) return;
        
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Enhanced boundary constraints with elastic feel
        const margin = 20;
        const maxX = window.innerWidth - windowRef.current.offsetWidth + margin;
        const maxY = window.innerHeight - windowRef.current.offsetHeight + margin;
        
        setPosition({
            x: Math.max(-margin, Math.min(newX, maxX)),
            y: Math.max(-margin, Math.min(newY, maxY))
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
        };
    }, [isDragging, dragOffset]);

    if (!isOpen) return null;

    return (
        <div className="window-overlay">
            <div
                ref={windowRef}
                className={`draggable-window ${isDragging ? 'dragging' : ''} ${isVisible ? 'visible' : ''}`}
                style={{
                    left: position.x,
                    top: position.y,
                }}
            >
                <div className="window-header" onMouseDown={handleMouseDown}>
                    <div className="window-title">{title}</div>
                    <div className="window-controls">
                        <button 
                            className="close-button" 
                            onClick={onClose}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            ×
                        </button>
                    </div>
                </div>
                <div className="window-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DraggableWindow;