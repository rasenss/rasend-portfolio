import React, { useEffect, useRef, useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, AlertCircle, FileText, Download } from 'lucide-react';

interface MyPdfViewerProps {
  pdfUrl: string;
  isDark: boolean;
}

export const MyPdfViewer: React.FC<MyPdfViewerProps> = ({ pdfUrl, isDark }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rendering, setRendering] = useState<boolean>(false);
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(0.6);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  // Monitor container size dynamically for smart rendering scales
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initial size check
    const initialWidth = containerRef.current.getBoundingClientRect().width;
    if (initialWidth > 0) {
      setContainerWidth(initialWidth);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setContainerWidth(width);
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Dynamically load PDF.js from highly available cloudflare CDN
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadPdfJs = async () => {
      if ((window as any).pdfjsLib) {
        return (window as any).pdfjsLib;
      }

      return new Promise<any>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
        script.async = true;
        script.onload = () => {
          const pdfjsLib = (window as any).pdfjsLib;
          if (pdfjsLib) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            resolve(pdfjsLib);
          } else {
            reject(new Error('PDF.js not available on window.'));
          }
        };
        script.onerror = () => {
          reject(new Error('Failed to download the PDF rendering engine bootstrap.'));
        };
        document.body.appendChild(script);
      });
    };

    loadPdfJs()
      .then((pdfjsLib) => {
        if (!isMounted) return;

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        loadingTask.promise
          .then((pdfDocument: any) => {
            if (!isMounted) return;
            setPdf(pdfDocument);
            setNumPages(pdfDocument.numPages);
            setCurrentPage(1);
            setLoading(false);
          })
          .catch((err: any) => {
            if (!isMounted) return;
            console.error('Error fetching/parsing document:', err);
            setError('Could not decode the authentic PDF structure. Click the button below to view.');
            setLoading(false);
          });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('PDF.js loading failed:', err);
        setError('Unable to wake the interactive document processor.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);

  // Page canvas rendering logic
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    let isCurrentRender = true;
    let renderTask: any = null;

    setRendering(true);

    pdf.getPage(currentPage)
      .then((page: any) => {
        if (!isCurrentRender || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Clean rendering context before starting new draw operation
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Render with DevicePixel Ratio for ultra crisp text and high-res certificate display
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Scale dynamically to fit container width beautifully (with padding margin accounted)
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const unscaledWidth = unscaledViewport.width || 800;
        const padding = 32; // px
        const availWidth = Math.max(280, containerWidth - padding);
        
        // Base scale for exact width fit, then scaled by our zoom parameter
        const baseScale = availWidth / unscaledWidth;
        const scale = baseScale * zoom;

        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width * pixelRatio;
        canvas.height = viewport.height * pixelRatio;
        
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        context.scale(pixelRatio, pixelRatio);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        renderTask.promise
          .then(() => {
            if (isCurrentRender) {
              setRendering(false);
            }
          })
          .catch((err: any) => {
            if (err.name === 'RenderingCancelledException' || err.name === 'WorkerDragout') {
              return; // Expected cancel trigger
            }
            console.error('Draw loop exception:', err);
            if (isCurrentRender) {
              setRendering(false);
            }
          });
      })
      .catch((err: any) => {
        console.error('Page lookup error:', err);
        if (isCurrentRender) {
          setRendering(false);
        }
      });

    return () => {
      isCurrentRender = false;
      if (renderTask && renderTask.cancel) {
        renderTask.cancel();
      }
    };
  }, [pdf, currentPage, zoom, containerWidth]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.6, prev - 0.2));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(2.0, prev + 0.2));
  };

  return (
    <div className={`flex flex-col rounded-2xl overflow-hidden border shadow-inner ${
      isDark ? 'bg-zinc-950 border-white/10' : 'bg-gray-50 border-gray-200'
    } mb-6`}>
      
      {/* Control Toolbar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3 border-b text-xs font-mono shrink-0 select-none ${
        isDark ? 'bg-zinc-900/90 border-white/5 text-gray-300' : 'bg-white border-gray-100 text-gray-700'
      }`}>
        {/* Navigation panel */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1 || loading}
            type="button"
            className={`p-1.5 rounded-lg border transition-all ${
              currentPage <= 1 
                ? 'opacity-40 cursor-not-allowed border-transparent' 
                : isDark ? 'bg-black/20 hover:bg-black/40 border-white/5 active:scale-95 cursor-pointer' : 'bg-gray-100 hover:bg-gray-200 border-gray-300/30 active:scale-95 cursor-pointer'
            }`}
            title="Previous Page"
          >
            <ChevronLeft size={14} />
          </button>
          
          <span className="px-2 min-w-[70px] text-center font-semibold">
            {loading ? 'Page -- / --' : `Page ${currentPage} / ${numPages}`}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= numPages || loading}
            type="button"
            className={`p-1.5 rounded-lg border transition-all ${
              currentPage >= numPages 
                ? 'opacity-40 cursor-not-allowed border-transparent' 
                : isDark ? 'bg-black/20 hover:bg-black/40 border-white/5 active:scale-95 cursor-pointer' : 'bg-gray-100 hover:bg-gray-200 border-gray-300/30 active:scale-95 cursor-pointer'
            }`}
            title="Next Page"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            disabled={loading}
            type="button"
            className={`p-1.5 rounded-lg border transition-all ${
              isDark ? 'bg-black/20 hover:bg-black/40 border-white/5 active:scale-95 cursor-pointer' : 'bg-gray-100 hover:bg-gray-200 border-gray-300/30 active:scale-95 cursor-pointer'
            }`}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>

          <span className="min-w-[42px] text-center font-semibold">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={loading}
            type="button"
            className={`p-1.5 rounded-lg border transition-all ${
              isDark ? 'bg-black/20 hover:bg-black/40 border-white/5 active:scale-95 cursor-pointer' : 'bg-gray-100 hover:bg-gray-200 border-gray-300/30 active:scale-95 cursor-pointer'
            }`}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Action Panel */}
        <div className="flex items-center gap-1.5 ml-auto">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 rounded-lg border flex items-center gap-1 hover:underline transition-all ${
              isDark ? 'bg-blue-600/10 hover:bg-blue-600/20 border-blue-500/25 text-blue-400' : 'bg-blue-50 hover:bg-blue-100 border-blue-200/50 text-blue-600 font-semibold'
            }`}
            title="Open Document in Fullscreen"
          >
            <Download size={13} />
            <span>Open PDF</span>
          </a>
        </div>
      </div>

      {/* Rendering viewport canvas container */}
      <div ref={containerRef} className={`relative w-full overflow-hidden flex justify-center items-center p-4 min-h-[350px] sm:min-h-[420px] transition-all ${
        isDark ? 'bg-[#0f1118]' : 'bg-gray-100/50'
      }`}>
        {loading && (
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-3 z-10 p-6 text-center select-none bg-black/5 backdrop-blur-sm">
            <Loader2 className={`animate-spin ${isDark ? 'text-blue-500' : 'text-blue-600'}`} size={32} />
            <div className="space-y-1">
              <span className={`text-xs font-mono uppercase tracking-wider block font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Engaging Document Reader
              </span>
              <p className="text-[11px] text-gray-500 max-w-[200px]">
                Assembling and decrypting verified PDF vectors...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-x-4 max-w-sm mx-auto flex flex-col items-center gap-3 p-6 rounded-2xl border text-center z-20 shadow-xl bg-[#090a0f] border-red-500/20">
            <AlertCircle className="text-red-400 animate-bounce" size={28} />
            <div className="space-y-1">
              <h5 className="text-sm font-bold text-white font-display">Rendering Alert</h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                {error}
              </p>
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <FileText size={13} />
              <span>Download PDF File Instead</span>
            </a>
          </div>
        )}

        {/* Canvas Element with rendering guard */}
        <div className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${
          loading || error ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`} style={{ maxWidth: '100%' }}>
          
          <canvas ref={canvasRef} className="block select-text max-w-full h-auto rounded-lg" style={{ maxWidth: '100%', height: 'auto' }} />

          {/* Quick loading mask during page flips or zoom triggers */}
          {rendering && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all">
              <div className="bg-[#0c0d12]/92 border border-white/10 rounded-xl p-3 flex items-center gap-2 shadow-xl select-none">
                <Loader2 size={14} className="animate-spin text-blue-500" />
                <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-widest">
                  Rendering...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
