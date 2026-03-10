"use client"

import { useState, useEffect, useRef } from "react"
import {
    FileText,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Minus,
    Plus,
    Maximize2
} from "lucide-react"
import { NuraButton } from "@/components/ui/button/button"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

// Set up worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
    url: string;
    title?: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [scale, setScale] = useState<number>(1.0)
    const [containerWidth, setContainerWidth] = useState<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages)
        setPageNumber(1)
    }

    // Handle container resize to make PDF responsive
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
        }

        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    const changePage = (offset: number) => {
        setPageNumber(prevPageNumber => {
            const next = prevPageNumber + offset
            return Math.max(1, Math.min(next, numPages))
        })
    }

    const goToFirstPage = () => setPageNumber(1)
    const goToLastPage = () => setPageNumber(numPages)

    const changeZoom = (delta: number) => {
        setScale(prev => Math.max(0.5, Math.min(prev + delta, 3.0)))
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 rounded-lg text-red-600">
                        <FileText size={20} />
                    </div>
                    <h2 className="text-sm font-bold text-gray-900">{title || "Session Document"}</h2>
                </div>
            </div>

            {/* Content & Controls Container */}
            <div className="bg-gray-100/50 rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100">
                {/* Navigation Bar (Reference Image Style) */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6 bg-white py-2 px-4 rounded-full shadow-sm border border-gray-100 w-fit mx-auto">
                    {/* Page Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={goToFirstPage}
                            disabled={pageNumber <= 1}
                            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors border border-gray-200"
                            title="First Page"
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button
                            onClick={() => changePage(-1)}
                            disabled={pageNumber <= 1}
                            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors border border-gray-200"
                            title="Previous Page"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-2 mx-1">
                            <input
                                type="number"
                                min={1}
                                max={numPages}
                                value={pageNumber}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value)
                                    if (val >= 1 && val <= numPages) setPageNumber(val)
                                }}
                                className="w-10 h-7 text-center text-xs font-bold border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#005954]"
                            />
                            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">of {numPages || '--'}</span>
                        </div>

                        <button
                            onClick={() => changePage(1)}
                            disabled={pageNumber >= numPages}
                            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors border border-gray-200"
                            title="Next Page"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={goToLastPage}
                            disabled={pageNumber >= numPages}
                            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors border border-gray-200"
                            title="Last Page"
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>

                    <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => changeZoom(-0.25)}
                            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                            title="Zoom Out"
                        >
                            <Minus size={16} />
                        </button>

                        <select
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1 focus:outline-none bg-white h-7 cursor-pointer"
                        >
                            <option value={0.5}>50%</option>
                            <option value={0.75}>75%</option>
                            <option value={1.0}>100%</option>
                            <option value={1.25}>125%</option>
                            <option value={1.5}>150%</option>
                            <option value={2.0}>200%</option>
                        </select>

                        <button
                            onClick={() => changeZoom(0.25)}
                            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                            title="Zoom In"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer Area */}
                <div
                    ref={containerRef}
                    className="relative w-full overflow-auto max-h-[70vh] rounded-2xl bg-white border border-gray-100 shadow-inner flex justify-center"
                >
                    <div className="p-4 md:p-8">
                        <Document
                            file={url}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="flex flex-col items-center justify-center p-20 animate-pulse">
                                    <FileText size={48} className="text-gray-200 mb-4" />
                                    <p className="text-gray-400 text-sm font-medium">Loading document...</p>
                                </div>
                            }
                            error={
                                <div className="flex flex-col items-center justify-center p-20 text-center">
                                    <FileText size={48} className="text-red-100 mb-4" />
                                    <p className="text-red-600 text-sm font-bold mb-2">Failed to load PDF</p>
                                    <p className="text-gray-500 text-xs">Please check your connection or the file link.</p>
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                width={containerWidth > 80 ? containerWidth - 80 : undefined}
                                className="shadow-2xl border border-gray-100"
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        </Document>
                    </div>
                </div>
            </div>

            {/* Footer / Mobile Help */}
            <p className="text-[10px] text-gray-400 text-center italic">
                Use controls above to navigate pages and zoom.
            </p>
        </div>
    )
}
