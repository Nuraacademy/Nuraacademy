"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useNuraRouter } from "@/components/providers/navigation-provider"
import {
    FileText,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
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
    editUrl?: string;
    isAdmin?: boolean;
}

export default function PDFViewer({ url, title, editUrl, isAdmin }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number>(0)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [scale, setScale] = useState<number>(1.0)
    const [containerWidth, setContainerWidth] = useState<number>(0)
    const [fileStatus, setFileStatus] = useState<"loading" | "found" | "not_found" | "error">("loading")
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useNuraRouter()

    useEffect(() => {
        const checkFile = async () => {
            try {
                const response = await fetch(url, { method: "HEAD" })
                if (response.status === 404) {
                    setFileStatus("not_found")
                } else if (!response.ok) {
                    setFileStatus("error")
                } else {
                    setFileStatus("found")
                }
            } catch (err) {
                console.error("Error checking file availability:", err)
                setFileStatus("error")
            }
        }
        checkFile()
    }, [url])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages)
        setPageNumber(1)
        setFileStatus("found")
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

    const renderError = (type: "not_found" | "error") => (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-xl border border-dashed border-gray-200 shadow-inner min-h-[400px]">
            <div className={`p-4 rounded-full mb-6 ${type === "not_found" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"}`}>
                <FileText size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                {type === "not_found" ? "File Not Found (404)" : "Failed to Load PDF"}
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                {type === "not_found"
                    ? "The document you're looking for might have been moved or deleted from the server."
                    : "Something went wrong while trying to retreive the document. Please try again later."}
            </p>

            <div className="flex items-center gap-3">
                <NuraButton
                    label="Retry"
                    variant="secondary"
                    className="h-10 px-6 border border-gray-200"
                    onClick={() => {
                        setFileStatus("loading")
                        window.location.reload()
                    }}
                />
                {editUrl && isAdmin && (
                    <NuraButton
                        label="Re-upload"
                        variant="primary"
                        className="h-10 px-6"
                        onClick={() => router.push(editUrl)}
                    />
                )}
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 rounded-xl text-red-600">
                        <FileText size={20} />
                    </div>
                    <h2 className="text-sm font-medium text-gray-900">{title || "Session Document"}</h2>
                </div>
                {fileStatus === "found" && (
                    <NuraButton
                        label="Open in New Tab"
                        variant="secondary"
                        className="h-8 text-[10px] md:text-xs px-3 border border-gray-200"
                        onClick={() => window.open(url, "_blank")}
                    />
                )}
            </div>

            {/* Content Container */}
            <div className="bg-gray-100/30 rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                {fileStatus === "found" ? (
                    <>
                        {/* PDF Viewer Area */}
                        <div
                            ref={containerRef}
                            className="relative w-full overflow-auto flex-grow rounded-xl bg-white border border-gray-100 shadow-inner flex justify-center mb-6"
                        >
                            <div className="p-4 md:p-8">
                                <Document
                                    file={url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={() => setFileStatus("error")}
                                    loading={
                                        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
                                            <FileText size={48} className="text-gray-200 mb-4" />
                                            <p className="text-gray-400 text-sm font-medium">Loading document...</p>
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

                        {/* Lime Control Bar (Matches User Image) */}
                        <div className="bg-[#D9F55C] py-3 px-6 rounded-xl flex flex-wrap items-center justify-center gap-4 shadow-md w-full max-w-2xl mx-auto">
                            {/* Page Controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goToFirstPage}
                                    disabled={pageNumber <= 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-black/40 text-black hover:bg-black/10 disabled:opacity-20 transition-all font-medium text-xs"
                                    title="First Page"
                                >
                                    K
                                </button>
                                <button
                                    onClick={() => changePage(-1)}
                                    disabled={pageNumber <= 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-black/40 text-black hover:bg-black/10 disabled:opacity-20 transition-all"
                                    title="Previous Page"
                                >
                                    <ChevronLeft size={18} />
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
                                        className="w-12 h-8 text-center text-sm font-medium border border-black/40 rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-black"
                                    />
                                    <span className="text-xs text-black font-medium whitespace-nowrap">of {numPages || '--'}</span>
                                </div>

                                <button
                                    onClick={() => changePage(1)}
                                    disabled={pageNumber >= numPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-black/40 text-black hover:bg-black/10 disabled:opacity-20 transition-all"
                                    title="Next Page"
                                >
                                    <ChevronRight size={18} />
                                </button>
                                <button
                                    onClick={goToLastPage}
                                    disabled={pageNumber >= numPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-black/40 text-black hover:bg-black/10 disabled:opacity-20 transition-all font-medium text-xs"
                                    title="Last Page"
                                >
                                    &gt;|
                                </button>
                            </div>

                            <div className="h-6 w-[1px] bg-black/20 mx-2"></div>

                            {/* Zoom Controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => changeZoom(-0.25)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-black/40 text-black hover:bg-black/10 transition-all"
                                    title="Zoom Out"
                                >
                                    <Minus size={18} />
                                </button>

                                <div className="relative">
                                    <select
                                        value={scale}
                                        onChange={(e) => setScale(parseFloat(e.target.value))}
                                        className="text-sm font-medium border border-black/40 rounded-xl px-3 py-1 bg-transparent h-8 cursor-pointer focus:outline-none appearance-none pr-8 min-w-[90px]"
                                    >
                                        <option value={0.5}>50%</option>
                                        <option value={0.75}>75%</option>
                                        <option value={1.0}>100%</option>
                                        <option value={1.25}>125%</option>
                                        <option value={1.5}>150%</option>
                                        <option value={2.0}>200%</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronRight size={14} className="rotate-90" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => changeZoom(0.25)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-black/40 text-black hover:bg-black/10 transition-all"
                                    title="Zoom In"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : fileStatus === "loading" ? (
                    <div className="flex-grow flex flex-col items-center justify-center animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded-xl"></div>
                    </div>
                ) : renderError(fileStatus)}
            </div>

            {/* Footer / Mobile Help */}
            {fileStatus === "found" && (
                <p className="text-[10px] text-gray-400 text-center italic">
                    Use controls above to navigate pages and zoom.
                </p>
            )}
        </div>
    )
}
