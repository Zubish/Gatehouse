import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodePassProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCodePass: React.FC<QRCodePassProps> = ({ value, size = 180, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).catch((err) => console.error('QR rendering error:', err));
    }
  }, [value, size]);

  return (
    <div className={`inline-block p-2 bg-white rounded-xl shadow-md ${className}`}>
      <canvas ref={canvasRef} className="rounded-lg" />
    </div>
  );
};
