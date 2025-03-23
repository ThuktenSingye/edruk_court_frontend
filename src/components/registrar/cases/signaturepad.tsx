"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SignaturePad = ({ onSave }: { onSave: (dataUrl: string) => void }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 400;
            canvas.height = 150;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.lineWidth = 2;
                ctx.lineCap = "round";
                ctx.strokeStyle = "black";
                contextRef.current = ctx;
            }
        }
    }, []);

    let isDrawing = false;

    const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = contextRef.current;
        if (!ctx) return;

        isDrawing = true;
        const { offsetX, offsetY } = getEventCoordinates(event, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (event: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = contextRef.current;
        if (!ctx) return;

        const { offsetX, offsetY } = getEventCoordinates(event, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawing = false;
        contextRef.current?.beginPath();
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const saveSignature = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            onSave(canvas.toDataURL("image/png"));
        }
    };

    const getEventCoordinates = (
        event: React.MouseEvent | React.TouchEvent,
        canvas: HTMLCanvasElement
    ) => {
        if ("touches" in event) {
            const touch = event.touches[0];
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top,
            };
        } else {
            return {
                offsetX: event.nativeEvent.offsetX,
                offsetY: event.nativeEvent.offsetY,
            };
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <canvas
                ref={canvasRef}
                className="border rounded-md w-[400px] h-[150px] bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            <div className="flex gap-4">
                <Button variant="outline" onClick={clearSignature}>
                    Clear
                </Button>
                <Button className="bg-primary-normal text-white" variant="default" onClick={saveSignature}>
                    Save Signature
                </Button>
            </div>
        </div>
    );
};

export default SignaturePad;
