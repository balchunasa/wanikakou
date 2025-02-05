import { Container, Row, Col, Button } from "react-bootstrap";
import { useRef, useState, useEffect } from "react";

const canvasWidth = window.innerWidth >= 600 ? Math.floor(window.innerWidth / 3) : 150;
const canvasHeight = canvasWidth;
const paddingPct = 0.2;

const penWidth = 7;
const strokeColor = "#888";

const DrawingCanvas = ({ drawingPaths }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [animationActive, setAnimationActive] = useState(false);
  const svgRef = useRef(null);
  const [boundingBox, setBoundingBox] = useState(null);

  useEffect(() => {
    const svgElement = svgRef.current;
    const kanjiElement = svgElement.querySelector("#kanji");
    const bbox = kanjiElement.getBBox();
    setBoundingBox(bbox);

    document.addEventListener("keydown", handleKeydown);

    return (() => {
      document.removeEventListener("keydown", handleKeydown);
    });

  }, []);

  useEffect(() => {
    clearCanvas();
  }, [drawingPaths]);

  const handleKeydown = (e) => {
    if (e.key === "c" || e.key === "C") clearCanvas();
    if (e.key === "a" || e.key === "A") startAnimation();
  }

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setPaths((prevPaths) => [
      ...prevPaths,
      [{ x: offsetX, y: offsetY }]
    ]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setPaths((prevPaths) => {
      const newPaths = [...prevPaths];
      if (newPaths.length > 0) {
        newPaths[newPaths.length - 1] = [
          ...newPaths[newPaths.length - 1],
          { x: offsetX, y: offsetY }
        ];
      }
      else {
        newPaths.push({ x: offsetX, y: offsetY });
      }
      return newPaths;
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const generatePathD = (points) => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  const clearCanvas = () => {
    setPaths([]);
    setAnimationActive(false); // Reset animation state when canvas is cleared
  };

  const getTransform = () => {
    if (!boundingBox) return "";
    const scaleX = canvasWidth / boundingBox.width * (1 - paddingPct);
    const scaleY = canvasHeight / boundingBox.height * (1 - paddingPct);
    const scale = Math.min(scaleX, scaleY);
    const translateX = (canvasWidth - boundingBox.width * scale) / 2 - boundingBox.x * scale;
    const translateY = (canvasHeight - boundingBox.height * scale) / 2 - boundingBox.y * scale;
    return `translate(${translateX}, ${translateY}) scale(${scale})`;
  };

  const startAnimation = () => {
    setAnimationActive(true);
  };

  const getAnimationDelay = (index) => {
    const strokeDuration = 0.5;
    return `${index * (strokeDuration)}s`;
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center">
        <Row>
            <Col>
            <svg
                ref={svgRef}
                width={canvasWidth}
                height={canvasHeight}
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                style={{ border: "1px solid black", touchAction: "none", userSelect: "none" }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={(e) => e.preventDefault()}
            >
                <g id="kanji" transform={getTransform()}>
                  {drawingPaths.map((drawingPath, index) => {
                    return (
                      <path key={index}
                      d = {drawingPath}
                      style={{
                        fill: "none",
                        stroke: strokeColor,
                        strokeWidth: 2,
                        strokeDasharray: "400",
                        strokeDashoffset: "400",
                        animation: animationActive ? `dash 2s linear forwards ${getAnimationDelay(index)}` : "none"
                        }}
                    />
                    );
                  })}
                </g>
                <g id="userstrokes">
                {paths.map((path, index) => (
                    <path
                    key={index}
                    d={generatePathD(path)}
                    style={{ fill: "none", stroke: "#000", strokeWidth: penWidth, strokeLinecap: "round", strokeLinejoin: "round" }}
                    />
                ))}
                </g>
            </svg>
            </Col>
        </Row>
        <Row className="mt-2">
            <Col>
                <Button className="mx-2" onClick={clearCanvas} size="sm">Clear Canvas (C)</Button>
                <Button className="mx-2" onClick={startAnimation} size="sm">Start Animation (A)</Button>
            </Col>
        </Row>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </Container>
  );
};

export default DrawingCanvas;
