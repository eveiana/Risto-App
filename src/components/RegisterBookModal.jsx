/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, Check, Book, Film, Tag, FileText, Sparkles, Image as ImageIcon } from "lucide-react";

// Helper to extract page images from a PDF using browser-side pdf.js
const extractPdfImages = async (base64Data, onProgress) => {
  return new Promise((resolve) => {
    const loadPdfJs = () => {
      if (window.pdfjsLib) {
        return Promise.resolve(window.pdfjsLib);
      }
      return new Promise((res, rej) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
          res(window.pdfjsLib);
        };
        script.onerror = () => rej(new Error("Failed to load PDF library"));
        document.head.appendChild(script);
      });
    };

    loadPdfJs()
      .then(async (pdfjs) => {
        try {
          const base64Content = base64Data.split(",")[1] || base64Data;
          const binaryString = atob(base64Content);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const loadingTask = pdfjs.getDocument({ data: bytes });
          const pdf = await loadingTask.promise;
          const pageImages = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            if (onProgress) {
              onProgress(`Extracting page image ${i} of ${pdf.numPages}...`);
            }
            const page = await pdf.getPage(i);
            
            const defaultViewport = page.getViewport({ scale: 1.0 });
            const maxDimension = 800;
            const scale = Math.min(maxDimension / defaultViewport.width, maxDimension / defaultViewport.height, 1.2);
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;
            
            const imgUrl = canvas.toDataURL("image/jpeg", 0.65);
            pageImages.push(imgUrl);
          }
          resolve(pageImages);
        } catch (err) {
          console.error("Error extracting PDF images:", err);
          resolve([]);
        }
      })
      .catch((err) => {
        console.error("PDF.js load failed:", err);
        resolve([]);
      });
  });
};

export default function RegisterBookModal({
  isOpen,
  onClose,
  onRegisterBook,
  isDarkMode,
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState(["Custom"]);
  const [genreInput, setGenreInput] = useState("");
  const [voicedBy, setVoicedBy] = useState("");
  
  // File upload states
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFileName, setCoverFileName] = useState("");
  const [pages, setPages] = useState([]);
  const [pageImages, setPageImages] = useState([]);
  const [bookFileName, setBookFileName] = useState("");
  const [customPageText, setCustomPageText] = useState("");

  const [dragCoverActive, setDragCoverActive] = useState(false);
  const [dragBookActive, setDragBookActive] = useState(false);
  const [activeTab, setActiveTab] = useState("express");
  const isExpress = activeTab === "express";
  const [isPdf, setIsPdf] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfParsingMessage, setPdfParsingMessage] = useState("");
  const [directUpload, setDirectUpload] = useState(true);

  const coverInputRef = useRef(null);
  const bookInputRef = useRef(null);

  // Batch PDF states
  const [batchBooks, setBatchBooks] = useState([]);
  const [dragBatchActive, setDragBatchActive] = useState(false);
  const batchBookInputRef = useRef(null);

  // Handle batch file drag
  const handleBatchDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragBatchActive(true);
    } else if (e.type === "dragleave") {
      setDragBatchActive(false);
    }
  };

  const handleBatchDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragBatchActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processBatchFiles(e.dataTransfer.files);
    }
  };

  // Process batch of files
  const processBatchFiles = async (files) => {
    if (!files || files.length === 0) return;
    setError("");

    const acceptedFiles = Array.from(files).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf") ||
        file.type === "text/plain" ||
        file.name.toLowerCase().endsWith(".txt") ||
        file.name.toLowerCase().endsWith(".md")
    );

    if (acceptedFiles.length === 0) {
      setError("Please select PDF (.pdf) or text (.txt, .md) files for Batch Import.");
      return;
    }

    const newBatchItems = acceptedFiles.map((file, idx) => {
      const cleanedName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      const capitalizedName = cleanedName
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      const isPdfFile = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

      return {
        id: `batch-book-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
        file: file,
        title: capitalizedName,
        author: "Original Author",
        description: `Batch import of ${file.name}`,
        genres: [isPdfFile ? "PDF Book" : "Text Book"],
        status: "pending",
        progressMessage: "Pending extraction...",
        pageImages: [],
        pages: [],
        isPdf: isPdfFile,
      };
    });

    setBatchBooks((prev) => [...prev, ...newBatchItems]);

    // Start processing files in the background sequentially to avoid browser hanging
    for (const item of newBatchItems) {
      await processSingleBatchFile(item.id, item.file, item.title, item.isPdf);
    }
  };

  const processSingleBatchFile = (itemId, file, title, isPdfFile) => {
    return new Promise((resolve) => {
      // Update status to processing
      setBatchBooks((prev) =>
        prev.map((b) =>
          b.id === itemId
            ? { ...b, status: "processing", progressMessage: isPdfFile ? "Reading PDF file..." : "Reading text file..." }
            : b
        )
      );

      const reader = new FileReader();

      if (isPdfFile) {
        reader.onload = async (e) => {
          try {
            const base64Data = e.target.result;

            // Use client-side pdf.js extraction to preserve exact original contents without AI modification
            const images = await extractPdfImages(base64Data, (progressMsg) => {
              setBatchBooks((prev) =>
                prev.map((b) => (b.id === itemId ? { ...b, progressMessage: progressMsg } : b))
              );
            });

            if (images && images.length > 0) {
              const mockPages = Array(images.length).fill(
                "Scroll or flip pages to read this document. High-fidelity page image displayed above."
              );

              setBatchBooks((prev) =>
                prev.map((b) =>
                  b.id === itemId
                    ? {
                        ...b,
                        status: "ready",
                        progressMessage: "Ready!",
                        pageImages: images,
                        pages: mockPages,
                      }
                    : b
                )
              );
            } else {
              setBatchBooks((prev) =>
                prev.map((b) =>
                  b.id === itemId
                    ? { ...b, status: "failed", progressMessage: "Extraction failed or empty" }
                    : b
                )
              );
            }
          } catch (err) {
            console.error("Batch PDF extract failed for:", title, err);
            setBatchBooks((prev) =>
              prev.map((b) =>
                b.id === itemId ? { ...b, status: "failed", progressMessage: "Failed to extract" } : b
              )
            );
          }
          resolve();
        };

        reader.onerror = () => {
          setBatchBooks((prev) =>
            prev.map((b) =>
              b.id === itemId ? { ...b, status: "failed", progressMessage: "Error reading file" } : b
            )
          );
          resolve();
        };

        reader.readAsDataURL(file);
      } else {
        // Non-PDF text files
        reader.onload = async (e) => {
          try {
            const text = e.target.result;

            // Split text into pages by custom chapter markings or every 900 chars
            const parts = text.split(/\n\s*Chapter\s+\d+/i);
            let parsedPages = [];
            if (parts.length > 1) {
              parsedPages = parts.map((part, index) => {
                if (index === 0) return part.trim();
                return `Chapter ${index}\n\n${part.trim()}`;
              }).filter(p => p.length > 0);
            } else {
              // Fallback: split roughly by double line breaks or chunk sizes
              const chunks = text.split(/\n\n\n+/);
              if (chunks.length > 1) {
                parsedPages = chunks.map(c => c.trim()).filter(p => p.length > 0);
              } else {
                // Chunk size of 1000 characters
                const size = 1000;
                for (let i = 0; i < text.length; i += size) {
                  parsedPages.push(text.substring(i, i + size).trim());
                }
              }
            }

            if (parsedPages.length > 0) {
              // Create dynamic clean background cover using canvas
              const canvas = document.createElement("canvas");
              canvas.width = 300;
              canvas.height = 375;
              const ctx = canvas.getContext("2d");

              const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
              grad.addColorStop(0, "#1f2937");
              grad.addColorStop(1, "#111827");
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              ctx.fillStyle = "#6366f1";
              ctx.fillRect(0, 0, canvas.width, 10);

              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 20px Georgia, serif";
              ctx.textAlign = "center";

              const words = title.split(" ");
              let line = "";
              let y = 140;
              for (let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + " ";
                let metrics = ctx.measureText(testLine);
                if (metrics.width > 240 && n > 0) {
                  ctx.fillText(line, canvas.width / 2, y);
                  line = words[n] + " ";
                  y += 28;
                } else {
                  line = testLine;
                }
              }
              ctx.fillText(line, canvas.width / 2, y);

              ctx.fillStyle = "#9ca3af";
              ctx.font = "italic 13px sans-serif";
              ctx.fillText("Chronicle Collection", canvas.width / 2, y + 45);

              const generatedCoverUrl = canvas.toDataURL("image/jpeg");

              setBatchBooks((prev) =>
                prev.map((b) =>
                  b.id === itemId
                    ? {
                        ...b,
                        status: "ready",
                        progressMessage: "Ready!",
                        pageImages: [],
                        pages: parsedPages,
                        coverUrl: generatedCoverUrl,
                      }
                    : b
                )
              );
            } else {
              setBatchBooks((prev) =>
                prev.map((b) =>
                  b.id === itemId
                    ? { ...b, status: "failed", progressMessage: "Text file was empty" }
                    : b
                )
              );
            }
          } catch (err) {
            console.error("Batch Text extract failed for:", title, err);
            setBatchBooks((prev) =>
              prev.map((b) =>
                b.id === itemId ? { ...b, status: "failed", progressMessage: "Failed to read" } : b
              )
            );
          }
          resolve();
        };

        reader.onerror = () => {
          setBatchBooks((prev) =>
            prev.map((b) =>
              b.id === itemId ? { ...b, status: "failed", progressMessage: "Error reading file" } : b
            )
          );
          resolve();
        };

        reader.readAsText(file);
      }
    });
  };

  const updateBatchBookTitle = (itemId, newTitle) => {
    setBatchBooks((prev) =>
      prev.map((b) => (b.id === itemId ? { ...b, title: newTitle } : b))
    );
  };

  const updateBatchBookAuthor = (itemId, newAuthor) => {
    setBatchBooks((prev) =>
      prev.map((b) => (b.id === itemId ? { ...b, author: newAuthor } : b))
    );
  };

  const deleteBatchBook = (itemId) => {
    setBatchBooks((prev) => prev.filter((b) => b.id !== itemId));
  };

  const handleBatchImportAll = async () => {
    setError("");
    const booksToImport = batchBooks.filter((b) => b.status === "ready");

    if (booksToImport.length === 0) {
      setError("No books are ready to import yet. Please wait for extraction or upload valid files.");
      return;
    }

    setIsParsingPdf(true); // Reuse the modal's loading overlay state to block other clicks
    setPdfParsingMessage(`Saving ${booksToImport.length} books to the cloud...`);

    let importedCount = 0;
    for (const b of booksToImport) {
      const finalCoverUrl =
        b.pageImages[0] ||
        b.coverUrl ||
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80";

      const newChronicle = {
        id: `custom-book-${Date.now()}-${importedCount}`,
        title: b.title.trim(),
        author: b.author.trim(),
        description: b.description.trim(),
        genres: b.genres,
        coverUrl: finalCoverUrl,
        pages: b.pages,
        pageImages: b.pageImages,
        voicedBy: "Robot Sync",
        type: "sondeka",
        isCustom: true,
        isPdf: b.isPdf,
      };

      try {
        await onRegisterBook(newChronicle);
        importedCount++;
        // Update status to imported
        setBatchBooks((prev) =>
          prev.map((item) =>
            item.id === b.id ? { ...item, status: "imported", progressMessage: "Imported!" } : item
          )
        );
      } catch (err) {
        console.error("Failed importing:", b.title, err);
      }
    }

    setPdfParsingMessage("");
    setIsParsingPdf(false);
    setSuccess(true);
    setTimeout(() => {
      // Clear imported items
      setBatchBooks((prev) =>
        prev.filter((b) => b.status !== "imported" && b.status !== "ready")
      );
      setSuccess(false);
    }, 2000);
  };

  // Genre selection standard presets
  const GENRE_PRESETS = ["Comic", "Thriller", "Action", "Experimental", "Visual Art", "Culinary", "Mythology", "Folklore"];

  // Handle Cover Image upload base64 converting
  const processCoverFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file for the cover.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverUrl(e.target.result);
      setCoverFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Handle Book File upload converting (parsing text, markdown, or PDF using Gemini)
  const processBookFile = async (file) => {
    if (!file) return;
    setError("");

    // Formatted fallback title from file name
    const cleanedName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    const capitalizedName = cleanedName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    // Check if it's a PDF file
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setIsPdf(true);
      setIsParsingPdf(true);
      setPdfParsingMessage(directUpload ? "Extracting original pages directly..." : "Analyzing and parsing PDF with Gemini AI...");
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result;
          
          let result = { title: "", author: "", pages: [] };
          
          if (!directUpload) {
            try {
              const response = await fetch("/api/parse-pdf", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ pdfData: base64Data })
              });

              if (response.ok) {
                result = await response.json();
              }
            } catch (e) {
              console.warn("AI PDF parse skipped or offline:", e);
            }
          }
          
          if (result.title) {
            setTitle(result.title);
          } else {
            setTitle(capitalizedName);
          }

          if (result.author) {
            setAuthor(result.author);
          } else {
            setAuthor("Community Author");
          }

          // Fallback parsing if AI pages are empty (e.g. mock layout page numbers)
          if (result.pages && result.pages.length > 0) {
            setPages(result.pages);
          } else {
            // Create placeholders for pages based on count, since pdf.js will show actual page images
            setPages(Array(10).fill("Enjoy reading this document in your story session. See the high-fidelity page illustrations above."));
          }
          
          setBookFileName(file.name);

          // Extract exact pictures / page images from PDF using browser-side pdf.js
          try {
            setPdfParsingMessage("Extracting original pages and pictures from PDF...");
            const images = await extractPdfImages(base64Data, (msg) => setPdfParsingMessage(msg));
            setPageImages(images);
            if (images && images.length > 0) {
              setCoverUrl(images[0]);
              setCoverFileName("Generated PDF Cover (Page 1)");
            }
            // Overwrite placeholder pages to match exact physical page count
            if (images && images.length > 0) {
              setPages(Array(images.length).fill("Scroll or flip pages to read this document. High-fidelity page image displayed above."));
            }
          } catch (imgErr) {
            console.error("Failed to extract page images:", imgErr);
          }

          setPdfParsingMessage("");
        } catch (err) {
          console.error("PDF Parse error:", err);
          setError(err instanceof Error ? err.message : "Failed to parse PDF file. Please try a different document.");
        } finally {
          setIsParsingPdf(false);
        }
      };
      reader.onerror = () => {
        setError("Failed to read PDF file.");
        setIsParsingPdf(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    if (file.type !== "text/plain" && !file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
      setError("Please select a plain text library file (.txt or .md) or a .pdf book file.");
      return;
    }
    setIsPdf(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      
      setTitle(capitalizedName);
      setAuthor("Community Author");

      // Split text into pages by custom chapter markings or every 900 chars
      const parts = text.split(/\n\s*Chapter\s+\d+/i);
      let parsedPages = [];
      if (parts.length > 1) {
        parsedPages = parts.map((part, index) => {
          if (index === 0) return part.trim();
          return `Chapter ${index}\n\n${part.trim()}`;
        }).filter(p => p.length > 0);
      } else {
        // Fallback: split roughly by double line breaks or chunk sizes
        const chunks = text.split(/\n\n\n+/);
        if (chunks.length > 1) {
          parsedPages = chunks.map(c => c.trim()).filter(p => p.length > 0);
        } else {
          // Chunk size of 1000 characters
          const size = 1000;
          for (let i = 0; i < text.length; i += size) {
            parsedPages.push(text.substring(i, i + size).trim());
          }
        }
      }
      setPages(parsedPages);
      setBookFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleCoverDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragCoverActive(true);
    } else if (e.type === "dragleave") {
      setDragCoverActive(false);
    }
  };

  const handleBookDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragBookActive(true);
    } else if (e.type === "dragleave") {
      setDragBookActive(false);
    }
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCoverActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processCoverFile(e.dataTransfer.files[0]);
    }
  };

  const handleBookDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragBookActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processBookFile(e.dataTransfer.files[0]);
    }
  };

  const addGenrePill = () => {
    if (genreInput.trim() && !genres.includes(genreInput.trim())) {
      setGenres([...genres, genreInput.trim()]);
      setGenreInput("");
    }
  };

  const removeGenrePill = (gToRemove) => {
    setGenres(genres.filter(g => g !== gToRemove));
  };

  const toggleGenrePreset = (preset) => {
    if (genres.includes(preset)) {
      setGenres(genres.filter(g => g !== preset));
    } else {
      setGenres([...genres, preset]);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setGenres(["Custom"]);
    setGenreInput("");
    setCoverUrl("");
    setCoverFileName("");
    setPages([]);
    setPageImages([]);
    setBookFileName("");
    setCustomPageText("");
    setVoicedBy("");
    setError("");
    setSuccess(false);
    setIsParsingPdf(false);
    setIsPdf(false);
    setPdfParsingMessage("");
    setBatchBooks([]);
    setActiveTab("express");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Chronicle title is required.");
      return;
    }
    if (!author.trim()) {
      setError("Chronicle author is required.");
      return;
    }

    // Determine book page inputs
    let bookPages = [...pages];
    if (customPageText.trim()) {
      bookPages.push(customPageText.trim());
    }

    if (bookPages.length === 0) {
      setError("Please write some story pages or upload a text file.");
      return;
    }

    // Fallback cover if none uploaded
    const finalCoverUrl = coverUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80";

    const newChronicle = {
      id: `custom-book-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      description: description.trim() || "A custom-registered narrative on the Risto storytelling repository.",
      genres: genres.length > 0 ? genres : ["Chronicle"],
      coverUrl: finalCoverUrl,
      pages: bookPages,
      pageImages: pageImages,
      voicedBy: voicedBy.trim() || "Robot Sync",
      type: "sondeka",
      isCustom: true,
      isPdf: isPdf || (pageImages && pageImages.length > 0)
    };

    onRegisterBook(newChronicle);
    setSuccess(true);
    setTimeout(() => {
      resetForm();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-md h-[88vh] flex flex-col rounded-[2.5rem] border overflow-hidden shadow-2xl ${
          isDarkMode ? "bg-zinc-950 border-zinc-900 text-white" : "bg-white border-zinc-200 text-zinc-900"
        }`}
        id="register-book-modal-container"
      >
        {/* Modal Header */}
        <div className={`p-5 border-b shrink-0 flex items-center justify-between ${
          isDarkMode ? "border-zinc-900" : "border-zinc-150"
        }`} id="register-book-header">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 fill-current" />
            <h3 className="font-serif font-medium text-lg tracking-tight">Register New Chronicle</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full hover:bg-zinc-800/10 cursor-pointer ${
              isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-black"
            }`}
            id="register-book-close-btn"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable Form) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6" id="register-book-body">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              id="register-success-pane"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-500/10 border border-zinc-500/20 flex items-center justify-center text-zinc-500">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="font-serif text-lg font-medium">Chronicle Registered!</h4>
              <p className="text-xs text-zinc-500 font-mono max-w-[240px] leading-relaxed">
                Your file and story have been successfully archived in the Risto database.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4" id="register-book-form-container">
              {/* Error Box */}
              {error && (
                <div className="p-3 bg-red-950/20 border border-red-900 text-red-400 text-xs rounded-xl text-center font-sans">
                  {error}
                </div>
              )}

              {/* Tab Selector */}
              <div className="flex p-1 bg-zinc-900/60 rounded-xl border border-zinc-850/60" id="register-mode-tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab("express")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all select-none cursor-pointer text-center ${
                    activeTab === "express"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  ⚡ Express Import
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("advanced")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all select-none cursor-pointer text-center ${
                    activeTab === "advanced"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  ⚙️ Advanced Form
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("batch")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all select-none cursor-pointer text-center ${
                    activeTab === "batch"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  📚 Batch PDFs
                </button>
              </div>

              {activeTab === "express" ? (
                // EXPRESS ONE-CLICK UPLOAD
                <form onSubmit={handleSubmit} className="space-y-4" id="register-book-express-form">
                  {/* Novel File Content Text Input / Upload (.txt, .md, or .pdf) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Upload Book File (PDF, TXT, or MD)
                    </label>

                    {/* Direct High-Fidelity Upload Switch */}
                    <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl mb-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide">⚡ Direct High-Fidelity Upload</span>
                        <span className="text-[8.5px] text-zinc-400">Keep 100% original page layout without AI alterations</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={directUpload} 
                          onChange={(e) => setDirectUpload(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div
                      onDragEnter={handleBookDrag}
                      onDragOver={handleBookDrag}
                      onDragLeave={handleBookDrag}
                      onDrop={handleBookDrop}
                      onClick={() => !isParsingPdf && bookInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        dragBookActive
                          ? "border-indigo-500 bg-indigo-500/5"
                          : isDarkMode
                          ? "border-zinc-800 hover:border-zinc-750 bg-zinc-900/40"
                          : "border-zinc-200 hover:border-zinc-300 bg-zinc-50"
                      } ${isParsingPdf ? "pointer-events-none opacity-80" : ""}`}
                      id="regbook-content-dropzone-express"
                    >
                      <input
                        type="file"
                        ref={bookInputRef}
                        onChange={(e) => processBookFile(e.target.files?.[0])}
                        accept=".txt,.md,.pdf"
                        className="hidden"
                        disabled={isParsingPdf}
                      />
                      {isParsingPdf ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-3" id="regbook-parsing-loader">
                          <div className="w-8 h-8 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-amber-500">{pdfParsingMessage}</p>
                            <p className="text-[9px] text-zinc-500 font-mono mt-1">Generating cover & formatting pages...</p>
                          </div>
                        </div>
                      ) : pages.length > 0 ? (
                        <div className="flex items-center gap-2.5 text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                          <Check className="w-4 h-4" />
                          <span>Book File Loaded Successfully!</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-zinc-500" />
                          <p className="text-[11px] text-zinc-400">
                            Drag &amp; drop file here or <span className="text-zinc-600 underline font-medium">browse files</span>
                          </p>
                          <p className="text-[9px] text-zinc-500 font-mono">Supports PDF books, .txt or .md files</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Card Preview */}
                  {pages.length > 0 && !isParsingPdf && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-2xl border flex flex-col gap-3 ${
                        isDarkMode ? "bg-zinc-900/40 border-zinc-850" : "bg-zinc-50 border-zinc-200"
                      }`}
                    >
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                        Review &amp; Instant Publish Details
                      </span>
                      
                      <div className="flex gap-3.5 items-start">
                        {/* Generated Cover */}
                        <div className="w-16 h-22 rounded-lg overflow-hidden border border-zinc-800/40 shrink-0 bg-zinc-900/60 flex items-center justify-center relative shadow-md">
                          {coverUrl ? (
                            <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="text-center p-1">
                              <Book className="w-4 h-4 text-zinc-650 mx-auto mb-1" />
                              <span className="text-[8px] font-mono text-zinc-500 block uppercase tracking-tight truncate max-w-full">{title || "Novel"}</span>
                            </div>
                          )}
                        </div>

                        {/* Quick adjust fields */}
                        <div className="flex-1 space-y-2">
                          <div>
                            <label className="text-[8.5px] font-mono uppercase text-zinc-500 font-bold block mb-0.5">
                              Chronicle Title *
                            </label>
                            <input
                              type="text"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className={`w-full h-8 px-2 text-xs rounded-lg focus:outline-none border font-sans ${
                                isDarkMode 
                                  ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-750" 
                                  : "bg-white border-zinc-200 text-zinc-900"
                              }`}
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[8.5px] font-mono uppercase text-zinc-500 font-bold block mb-0.5">
                              Author Name *
                            </label>
                            <input
                              type="text"
                              value={author}
                              onChange={(e) => setAuthor(e.target.value)}
                              className={`w-full h-8 px-2 text-xs rounded-lg focus:outline-none border font-sans ${
                                isDarkMode 
                                  ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-750" 
                                  : "bg-white border-zinc-200 text-zinc-900"
                              }`}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-zinc-500 font-mono border-t border-zinc-850/40 pt-2 shrink-0">
                        <span>Compiled: <strong className="text-indigo-400">{pages.length} Pages</strong></span>
                        <span className="max-w-[150px] truncate block text-right">File: <strong className="text-zinc-400">{bookFileName}</strong></span>
                      </div>
                    </motion.div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-4 flex border-t border-zinc-900 gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        onClose();
                      }}
                      className={`flex-1 h-11 text-xs font-semibold rounded-xl cursor-pointer ${
                        isDarkMode ? "bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={pages.length === 0 || isParsingPdf}
                      className={`flex-1 h-11 text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 ${
                        pages.length > 0 && !isParsingPdf
                          ? "bg-indigo-600 hover:bg-indigo-550 text-white cursor-pointer"
                          : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-850"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      Publish Instantly
                    </button>
                  </div>

                  <p className="text-[10px] text-zinc-500 font-mono text-center pt-1 leading-relaxed">
                    Want to customize descriptions, genres, or voice actors? Switch to the <strong>Advanced Form</strong> at the top.
                  </p>
                </form>
              ) : activeTab === "advanced" ? (
                // ADVANCED FULL FORM
                <form onSubmit={handleSubmit} className="space-y-4" id="register-book-advanced-form">
                  {/* Title Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Chronicle Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ascent of Kisumu"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full h-11 px-4 text-xs rounded-xl focus:outline-none border font-sans ${
                        isDarkMode 
                          ? "bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400"
                      }`}
                      id="regbook-title-input"
                      required
                    />
                  </div>

                  {/* Author Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Evaline Atieno"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className={`w-full h-11 px-4 text-xs rounded-xl focus:outline-none border font-sans ${
                        isDarkMode 
                          ? "bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400"
                      }`}
                      id="regbook-author-input"
                      required
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Short Description
                    </label>
                    <textarea
                      placeholder="A brief history, synopsis or context of this custom chronicle..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className={`w-full p-3 text-xs rounded-xl focus:outline-none border font-sans resize-none ${
                        isDarkMode 
                          ? "bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400"
                      }`}
                      id="regbook-description-input"
                    />
                  </div>

                  {/* Cover File Upload (Drag and drop) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Upload Cover Image file
                    </label>
                    <div
                      onDragEnter={handleCoverDrag}
                      onDragOver={handleCoverDrag}
                      onDragLeave={handleCoverDrag}
                      onDrop={handleCoverDrop}
                      onClick={() => coverInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        dragCoverActive
                          ? "border-indigo-500 bg-indigo-500/5"
                          : isDarkMode
                          ? "border-zinc-800 hover:border-zinc-750 bg-zinc-900/40"
                          : "border-zinc-200 hover:border-zinc-300 bg-zinc-50"
                      }`}
                      id="regbook-cover-dropzone"
                    >
                      <input
                        type="file"
                        ref={coverInputRef}
                        onChange={(e) => processCoverFile(e.target.files?.[0])}
                        accept="image/*"
                        className="hidden"
                      />
                      {coverUrl ? (
                        <div className="flex items-center gap-2 text-xs">
                          <img src={coverUrl} alt="Preview" className="w-10 h-12 object-cover rounded-md" referrerPolicy="no-referrer" />
                          <div className="text-left max-w-[200px] truncate">
                            <p className="font-semibold text-zinc-200 truncate">{coverFileName || "Custom cover"}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">Image loaded successfully</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5 text-zinc-500" />
                          <p className="text-[11px] text-zinc-400">
                            Drag and drop raw covers here or <span className="text-zinc-600 underline font-medium">browse files</span>
                          </p>
                          <p className="text-[9px] text-zinc-500 font-mono">Supports PNG, JPG, or WEBP</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Novel File Content Text Input / Upload (.txt, .md, or .pdf) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Upload Book / Novel file (PDF, TXT, MD)
                    </label>

                    {/* Direct High-Fidelity Upload Switch (Advanced) */}
                    <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl mb-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide">⚡ Direct High-Fidelity Upload</span>
                        <span className="text-[8.5px] text-zinc-400">Keep 100% original page layout without AI alterations</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={directUpload} 
                          onChange={(e) => setDirectUpload(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div
                      onDragEnter={handleBookDrag}
                      onDragOver={handleBookDrag}
                      onDragLeave={handleBookDrag}
                      onDrop={handleBookDrop}
                      onClick={() => !isParsingPdf && bookInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        dragBookActive
                          ? "border-indigo-500 bg-indigo-500/5"
                          : isDarkMode
                          ? "border-zinc-800 hover:border-zinc-750 bg-zinc-900/40"
                          : "border-zinc-200 hover:border-zinc-300 bg-zinc-50"
                      } ${isParsingPdf ? "pointer-events-none opacity-80" : ""}`}
                      id="regbook-content-dropzone"
                    >
                      <input
                        type="file"
                        ref={bookInputRef}
                        onChange={(e) => processBookFile(e.target.files?.[0])}
                        accept=".txt,.md,.pdf"
                        className="hidden"
                        disabled={isParsingPdf}
                      />
                      {isParsingPdf ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-3" id="regbook-parsing-loader">
                          <div className="w-8 h-8 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                          <div className="text-center">
                            <p className="text-xs font-semibold text-amber-500">{pdfParsingMessage}</p>
                            <p className="text-[9px] text-zinc-500 font-mono mt-1">Extracting title, author, and formatting pages...</p>
                          </div>
                        </div>
                      ) : pages.length > 0 ? (
                        <div className="flex items-center gap-2.5 text-xs">
                          <FileText className="w-5 h-5 text-zinc-500" />
                          <div className="text-left max-w-[200px] truncate">
                            <p className="font-semibold text-zinc-200 truncate">{bookFileName}</p>
                            <p className="text-[10px] text-zinc-500 font-mono">{pages.length} Pages compiled successfully</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-zinc-500" />
                          <p className="text-[11px] text-zinc-400">
                            Drag &amp; drop file here or <span className="text-zinc-600 underline font-medium">browse files</span>
                          </p>
                          <p className="text-[9px] text-zinc-500 font-mono">Supports PDF books, .txt or .md files</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Fallback Custom Page text */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Or Type Novel page directly
                    </label>
                    <textarea
                      placeholder="If you don't upload a text file, type the story chapter, book page, or oral transcription content here..."
                      value={customPageText}
                      onChange={(e) => setCustomPageText(e.target.value)}
                      rows={3}
                      className={`w-full p-3 text-xs rounded-xl focus:outline-none border font-sans resize-none ${
                        isDarkMode 
                          ? "bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400"
                      }`}
                      id="regbook-text-direct-input"
                    />
                  </div>

                  {/* Genre Selection Chips */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Genre Categories
                    </label>
                    <div className="flex flex-wrap gap-1.5 pt-1" id="regbook-genre-presets">
                      {GENRE_PRESETS.map(preset => {
                        const isSelected = genres.includes(preset);
                        return (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => toggleGenrePreset(preset)}
                            className={`text-[9.5px] font-sans font-bold uppercase py-1 px-2.5 rounded-md cursor-pointer transition-colors border ${
                              isSelected
                                ? "bg-black border-black text-white"
                                : isDarkMode
                                ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                                : "bg-zinc-100 border-zinc-200 text-zinc-650 hover:text-black"
                            }`}
                            id={`regbook-preset-${preset}`}
                          >
                            {preset}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Genre Adder */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add custom tag"
                        value={genreInput}
                        onChange={(e) => setGenreInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addGenrePill();
                          }
                        }}
                        className={`flex-1 h-9 px-3 text-xs rounded-lg focus:outline-none border font-sans ${
                          isDarkMode 
                            ? "bg-zinc-900 border-zinc-850 text-white focus:border-zinc-700" 
                            : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400"
                        }`}
                        id="regbook-custom-genre-input"
                      />
                      <button
                        type="button"
                        onClick={addGenrePill}
                        className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                          isDarkMode ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-900 text-white hover:bg-black"
                        }`}
                        id="regbook-custom-genre-add-btn"
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected custom genres lists */}
                    {genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2" id="regbook-genres-current">
                        {genres.map(g => (
                          <span
                            key={g}
                            className="inline-flex items-center gap-1 bg-zinc-850 text-zinc-300 text-[10px] py-0.5 pl-2 pr-1.5 rounded-full border border-zinc-800"
                          >
                            {g}
                            <button
                              type="button"
                              onClick={() => removeGenrePill(g)}
                              className="w-3.5 h-3.5 rounded-full bg-zinc-900 flex items-center justify-center text-[8px] text-zinc-500 hover:text-white cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Voice Actor / Voiced By Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Voiced By (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Thayũ Kilili"
                      value={voicedBy}
                      onChange={(e) => setVoicedBy(e.target.value)}
                      className={`w-full h-11 px-4 text-xs rounded-xl focus:outline-none border font-sans ${
                        isDarkMode 
                          ? "bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400"
                      }`}
                      id="regbook-voicedby-input"
                    />
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 flex border-t border-zinc-900 gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        onClose();
                      }}
                      className={`flex-1 h-11 text-xs font-semibold rounded-xl cursor-pointer ${
                        isDarkMode ? "bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900"
                      }`}
                      id="regbook-cancel-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-11 bg-black hover:bg-zinc-800 text-white font-semibold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      id="regbook-submit-btn"
                    >
                      <Book className="w-4 h-4" />
                      Save Chronicle
                    </button>
                  </div>
                </form>
              ) : (
                // BATCH IMPORT FORM
                <div className="space-y-4 font-sans" id="register-book-batch-form">
                  {/* Dropzone for Batch Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                      Upload Multiple Books (PDF, TXT, or MD)
                    </label>
                    <div
                      onDragEnter={handleBatchDrag}
                      onDragOver={handleBatchDrag}
                      onDragLeave={handleBatchDrag}
                      onDrop={handleBatchDrop}
                      onClick={() => !isParsingPdf && batchBookInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        dragBatchActive
                          ? "border-indigo-500 bg-indigo-500/5"
                          : isDarkMode
                          ? "border-zinc-800 hover:border-zinc-750 bg-zinc-900/40"
                          : "border-zinc-200 hover:border-zinc-300 bg-zinc-50"
                      } ${isParsingPdf ? "pointer-events-none opacity-80" : ""}`}
                      id="regbook-batch-dropzone"
                    >
                      <input
                        type="file"
                        ref={batchBookInputRef}
                        onChange={(e) => processBatchFiles(e.target.files)}
                        accept=".pdf,.txt,.md"
                        multiple
                        className="hidden"
                        disabled={isParsingPdf}
                      />
                      {isParsingPdf ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-2" id="regbook-batch-saving-loader">
                          <div className="w-8 h-8 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                          <p className="text-xs font-semibold text-amber-500">{pdfParsingMessage}</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-zinc-500 mb-1" />
                          <p className="text-xs font-semibold text-zinc-300">Drag &amp; drop multiple PDFs, TXTs, or MDs</p>
                          <p className="text-[10px] text-zinc-500">
                            or click to <span className="text-indigo-400 underline font-medium">browse files</span>
                          </p>
                          <p className="text-[9px] text-zinc-500 font-mono mt-1">
                            Fully client-side, multi-page parsing. No manual formatting required.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Batch Books List */}
                  {batchBooks.length > 0 && (
                    <div className="space-y-3" id="batch-books-list-container">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                          Selected Chronicles ({batchBooks.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setBatchBooks([])}
                          disabled={isParsingPdf}
                          className="text-[9px] font-mono text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[38vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {batchBooks.map((item) => (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-xl border flex flex-col gap-3 relative transition-all ${
                              isDarkMode ? "bg-zinc-900/60 border-zinc-850" : "bg-zinc-50 border-zinc-200"
                            }`}
                          >
                            {/* Document Info Row */}
                            <div className="flex gap-3.5 items-start">
                              <div className="w-11 h-15 rounded-lg overflow-hidden border border-zinc-800/60 shrink-0 bg-zinc-950 flex items-center justify-center relative shadow">
                                {(item.pageImages?.[0] || item.coverUrl) ? (
                                  <img
                                    src={item.pageImages?.[0] || item.coverUrl}
                                    alt="Book Cover Preview"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <Book className="w-5 h-5 text-zinc-700" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0 space-y-2">
                                {/* Title Input */}
                                <div>
                                  <label className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-semibold block mb-0.5">
                                    Book Title
                                  </label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateBatchBookTitle(item.id, e.target.value)}
                                    disabled={isParsingPdf || item.status === "imported"}
                                    className={`w-full h-8 px-2 text-xs rounded-lg focus:outline-none border font-sans ${
                                      isDarkMode
                                        ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700"
                                        : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400"
                                    } ${item.status === "imported" ? "opacity-60 pointer-events-none" : ""}`}
                                    placeholder="Enter Title"
                                    required
                                  />
                                </div>

                                {/* Author Input */}
                                <div>
                                  <label className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-semibold block mb-0.5">
                                    Author Name
                                  </label>
                                  <input
                                    type="text"
                                    value={item.author}
                                    onChange={(e) => updateBatchBookAuthor(item.id, e.target.value)}
                                    disabled={isParsingPdf || item.status === "imported"}
                                    className={`w-full h-8 px-2 text-xs rounded-lg focus:outline-none border font-sans ${
                                      isDarkMode
                                        ? "bg-zinc-950 border-zinc-850 text-white focus:border-zinc-700"
                                        : "bg-white border-zinc-200 text-zinc-900 focus:border-zinc-400"
                                    } ${item.status === "imported" ? "opacity-60 pointer-events-none" : ""}`}
                                    placeholder="Enter Author"
                                    required
                                  />
                                </div>
                              </div>

                              {/* Action Buttons */}
                              {item.status !== "imported" && !isParsingPdf && (
                                <button
                                  type="button"
                                  onClick={() => deleteBatchBook(item.id)}
                                  className="text-zinc-500 hover:text-red-400 p-1.5 rounded transition-colors self-start cursor-pointer"
                                  title="Remove from batch"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {/* Status and Page Count */}
                            <div className="flex items-center justify-between text-[9px] font-mono pt-2 border-t border-zinc-850/40">
                              <div className="flex items-center gap-1.5">
                                {item.status === "processing" && (
                                  <div className="w-3 h-3 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                                )}
                                {item.status === "ready" && (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                )}
                                {item.status === "imported" && (
                                  <Check className="w-3 h-3 text-indigo-400" />
                                )}
                                <span
                                  className={
                                    item.status === "ready"
                                      ? "text-emerald-500 font-medium"
                                      : item.status === "processing"
                                      ? "text-amber-500 font-medium"
                                      : item.status === "failed"
                                      ? "text-red-400 font-medium"
                                      : item.status === "imported"
                                      ? "text-indigo-400 font-bold"
                                      : "text-zinc-500"
                                  }
                                >
                                  {item.progressMessage}
                                </span>
                              </div>
                              {item.pageImages?.length > 0 && (
                                <span className="text-zinc-400 font-bold">
                                  {item.pageImages.length} High-Res Pages
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-4 flex border-t border-zinc-900 gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        onClose();
                      }}
                      className={`flex-1 h-11 text-xs font-semibold rounded-xl cursor-pointer ${
                        isDarkMode
                          ? "bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-900"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleBatchImportAll}
                      disabled={batchBooks.filter((b) => b.status === "ready").length === 0 || isParsingPdf}
                      className={`flex-1 h-11 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 ${
                        batchBooks.filter((b) => b.status === "ready").length > 0 && !isParsingPdf
                          ? "bg-indigo-600 hover:bg-indigo-550 text-white cursor-pointer"
                          : "bg-zinc-900 text-zinc-650 cursor-not-allowed border border-zinc-850"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      Import {batchBooks.filter((b) => b.status === "ready").length} Books
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
