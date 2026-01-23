import React, { useState, useRef, useEffect } from 'react';
import { evaluate } from 'mathjs';

export default function LifebloodCalculator() {
  const [expression, setExpression] = useState('sin(x)');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [error, setError] = useState('');
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcExpression, setCalcExpression] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    drawGraph();
  }, [expression, xMin, xMax, yMin, yMax]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with dark blue background
    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1a2d4d';
    ctx.lineWidth = 1;

    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    const xAxisY = height - ((-yMin) / yRange) * height;
    const yAxisX = ((-xMin) / xRange) * width;

    ctx.strokeStyle = '#6fb4e8';
    ctx.lineWidth = 2;

    // X-axis
    if (xAxisY >= 0 && xAxisY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, xAxisY);
      ctx.lineTo(width, xAxisY);
      ctx.stroke();
    }

    // Y-axis
    if (yAxisX >= 0 && yAxisX <= width) {
      ctx.beginPath();
      ctx.moveTo(yAxisX, 0);
      ctx.lineTo(yAxisX, height);
      ctx.stroke();
    }

    // Plot function
    try {
      ctx.strokeStyle = '#4da6ff';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#4da6ff';
      ctx.beginPath();

      let firstPoint = true;
      const numPoints = width * 2;

      for (let i = 0; i < numPoints; i++) {
        const x = xMin + (i / numPoints) * xRange;
        
        try {
          const y = evaluate(expression.toLowerCase(), { x });
          
          if (typeof y === 'number' && isFinite(y)) {
            const canvasX = ((x - xMin) / xRange) * width;
            const canvasY = height - ((y - yMin) / yRange) * height;

            if (canvasY >= -100 && canvasY <= height + 100) {
              if (firstPoint) {
                ctx.moveTo(canvasX, canvasY);
                firstPoint = false;
              } else {
                ctx.lineTo(canvasX, canvasY);
              }
            } else {
              firstPoint = true;
            }
          } else {
            firstPoint = true;
          }
        } catch (e) {
          firstPoint = true;
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
      setError('');
    } catch (e) {
      setError('Invalid expression');
    }

    // Draw axis labels
    ctx.fillStyle = '#6fb4e8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let i = 0; i <= 10; i++) {
      const x = xMin + (xRange / 10) * i;
      const canvasX = (width / 10) * i;
      if (Math.abs(x) > 0.01 || x === 0) {
        ctx.fillText(x.toFixed(1), canvasX, xAxisY > height - 20 ? height - 5 : xAxisY + 15);
      }
    }

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i++) {
      const y = yMin + (yRange / 10) * i;
      const canvasY = height - (height / 10) * i;
      if (Math.abs(y) > 0.01 || y === 0) {
        ctx.fillText(y.toFixed(1), yAxisX > 35 ? yAxisX - 5 : 30, canvasY + 4);
      }
    }
  };

  const handleCalcButton = (value) => {
    if (value === 'C') {
      setCalcDisplay('0');
      setCalcExpression('');
    } else if (value === '=') {
      try {
        const result = evaluate(calcExpression);
        setCalcDisplay(result.toString());
        setCalcExpression(result.toString());
      } catch (e) {
        setCalcDisplay('Error');
        setCalcExpression('');
      }
    } else if (value === '←') {
      const newExp = calcExpression.slice(0, -1);
      setCalcExpression(newExp);
      setCalcDisplay(newExp || '0');
    } else {
      const newExp = calcExpression === '0' ? value : calcExpression + value;
      setCalcExpression(newExp);
      setCalcDisplay(newExp);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(to bottom, #0a1628, #1a2d4d)' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#e0f4ff', textShadow: '0 0 20px #4da6ff' }}>
          Graphing Calculator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Standard Calculator */}
          <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 shadow-2xl border-2" style={{ borderColor: '#4da6ff' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#6fb4e8' }}>Calculator</h2>
            <div className="mb-4 p-4 bg-gray-800 rounded border-2 text-right text-2xl font-mono text-white min-h-16 flex items-center justify-end" style={{ borderColor: '#4da6ff' }}>
              {calcDisplay}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcButton(btn)}
                  className="p-4 rounded font-bold text-lg transition-all hover:brightness-125"
                  style={{ 
                    backgroundColor: btn === '=' ? '#4da6ff' : '#1a2d4d',
                    color: '#e0f4ff',
                    border: '2px solid #6fb4e8'
                  }}
                >
                  {btn}
                </button>
              ))}
              <button
                onClick={() => handleCalcButton('C')}
                className="p-4 rounded font-bold text-lg col-span-2 transition-all hover:brightness-125"
                style={{ 
                  backgroundColor: '#d64545',
                  color: '#fff',
                  border: '2px solid #ff6b6b'
                }}
              >
                Clear
              </button>
              <button
                onClick={() => handleCalcButton('←')}
                className="p-4 rounded font-bold text-lg col-span-2 transition-all hover:brightness-125"
                style={{ 
                  backgroundColor: '#1a2d4d',
                  color: '#e0f4ff',
                  border: '2px solid #6fb4e8'
                }}
              >
                ←
              </button>
              <button
                onClick={() => handleCalcButton('(')}
                className="p-4 rounded font-bold text-lg transition-all hover:brightness-125"
                style={{ 
                  backgroundColor: '#1a2d4d',
                  color: '#e0f4ff',
                  border: '2px solid #6fb4e8'
                }}
              >
                (
              </button>
              <button
                onClick={() => handleCalcButton(')')}
                className="p-4 rounded font-bold text-lg transition-all hover:brightness-125"
                style={{ 
                  backgroundColor: '#1a2d4d',
                  color: '#e0f4ff',
                  border: '2px solid #6fb4e8'
                }}
              >
                )
              </button>
              <button
                onClick={() => handleCalcButton('^')}
                className="p-4 rounded font-bold text-lg transition-all hover:brightness-125"
                style={{ 
                  backgroundColor: '#1a2d4d',
                  color: '#e0f4ff',
                  border: '2px solid #6fb4e8'
                }}
              >
                ^
              </button>
              <button
                onClick={() => handleCalcButton('sqrt(')}
                className="p-4 rounded font-bold text-sm transition-all hover:brightness-125"
                style={{ 
                  backgroundColor: '#1a2d4d',
                  color: '#e0f4ff',
                  border: '2px solid #6fb4e8'
                }}
              >
                √
              </button>
            </div>
          </div>

          {/* Graphing Section */}
          <div className="lg:col-span-2 bg-gray-900 bg-opacity-80 rounded-lg p-6 shadow-2xl border-2" style={{ borderColor: '#4da6ff' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#6fb4e8' }}>Function Grapher</h2>
            
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#6fb4e8' }}>
                  Function f(x) = 
                </label>
                <input
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ borderColor: '#4da6ff', '--tw-ring-color': '#4da6ff' }}
                  placeholder="e.g., sin(x), x^2, tan(x)"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Try: sin(x), cos(x), tan(x), x^2, sqrt(x), abs(x), log(x), exp(x)
                </p>
              </div>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#6fb4e8' }}>X Min</label>
                  <input
                    type="number"
                    value={xMin}
                    onChange={(e) => setXMin(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border-2 rounded text-white focus:outline-none"
                    style={{ borderColor: '#4da6ff' }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#6fb4e8' }}>X Max</label>
                  <input
                    type="number"
                    value={xMax}
                    onChange={(e) => setXMax(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border-2 rounded text-white focus:outline-none"
                    style={{ borderColor: '#4da6ff' }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#6fb4e8' }}>Y Min</label>
                  <input
                    type="number"
                    value={yMin}
                    onChange={(e) => setYMin(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border-2 rounded text-white focus:outline-none"
                    style={{ borderColor: '#4da6ff' }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#6fb4e8' }}>Y Max</label>
                  <input
                    type="number"
                    value={yMax}
                    onChange={(e) => setYMax(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-800 border-2 rounded text-white focus:outline-none"
                    style={{ borderColor: '#4da6ff' }}
                  />
                </div>
              </div>
            </div>

            <div className="border-4 rounded-lg overflow-hidden" style={{ borderColor: '#4da6ff' }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: 'sin(x)', func: 'sin(x)' },
                { label: 'cos(x)', func: 'cos(x)' },
                { label: 'tan(x)', func: 'tan(x)' },
                { label: 'x²', func: 'x^2' },
                { label: 'x³', func: 'x^3' },
                { label: '1/x', func: '1/x' },
                { label: '√x', func: 'sqrt(x)' },
                { label: 'e^x', func: 'exp(x)' }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setExpression(preset.func)}
                  className="px-3 py-1 rounded text-sm font-medium transition-all hover:brightness-125"
                  style={{ 
                    backgroundColor: '#4da6ff', 
                    color: '#0a1628',
                    border: '2px solid #6fb4e8'
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
