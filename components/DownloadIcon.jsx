"use client";

import React from "react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

const DownloadIcon = ({ editorRef, title }) => {
  const handleDownload = async () => {
    if (!editorRef?.current) {
      toast.error("Editor not found.");
      return;
    }

    try {
      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.left = "-9999px";
      iframe.style.top = "0";
      iframe.style.width = "900px";
      iframe.style.height = "auto";
      iframe.setAttribute("id", "pdf-frame");
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow.document;

      doc.open();
      doc.write(`
        <html>
          <head>
            <style>
              * { box-sizing: border-box; }
              body {
                font-family: sans-serif;
                color: #000;
                padding: 20px;
                margin: 0;
                max-width: 800px;
              }
              img {
                max-width: 100%;
                height: auto;
                display: block;
                margin: 10px auto;
              }
              h1, h2, h3 { color: #222; }
              p {
                font-size: 16px;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>${editorRef.current.innerHTML}</body>
        </html>
      `);
      doc.close();

      iframe.onload = async () => {
        const iframeBody = iframe.contentDocument.body;

        await new Promise((res) => setTimeout(res, 600));

        const canvas = await html2canvas(iframeBody, {
          scale: 2,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        const pageHeight = pdf.internal.pageSize.getHeight();
        let position = 0;

        while (position < pdfHeight) {
          pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, pdfHeight);
          position += pageHeight;
          if (position < pdfHeight) {
            pdf.addPage();
          }
        }

        pdf.save(`${title || "blog"}.pdf`);
        document.body.removeChild(iframe);
        toast.success("✅ Blog downloaded as PDF!");
      };
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("❌ Failed to download PDF.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="cursor-pointer p-2.5 rounded-xl bg-sky-100 shadow-md hover:shadow-lg transition"
      title="Download Blog as PDF"
    >
      <FaDownload size={24} className="text-amber-600" />
    </button>
  );
};

export default DownloadIcon;
