"use client";
import React, { useEffect } from "react";

const ImageDragResizeHandler = ({ editorRef }) => {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    let selectedImg = null;
    let startX, startWidth;

    // ✅ Select image on click
    const handleClick = (e) => {
      if (e.target.tagName === "IMG") {
        e.stopPropagation();
        if (selectedImg && selectedImg !== e.target) {
          selectedImg.classList.remove("selected-image");
          removeHandles(selectedImg);
          removeFloatControls();
        }

        selectedImg = e.target;
        selectedImg.classList.add("selected-image");
        addHandles(selectedImg);
        addFloatControls(selectedImg);
      } else {
        if (selectedImg) {
          selectedImg.classList.remove("selected-image");
          removeHandles(selectedImg);
          removeFloatControls();
          selectedImg = null;
        }
      }
    };

    // ✅ Add resize handle
    const addHandles = (img) => {
      const wrapper = img.closest(".img-wrapper") || wrapImage(img);
      ["se"].forEach((dir) => {
        const handle = document.createElement("div");
        handle.className = `resize-handle ${dir}`;
        handle.addEventListener("mousedown", (e) => initResize(e, img));
        wrapper.appendChild(handle);
      });
    };

    const removeHandles = (img) => {
      const wrapper = img.closest(".img-wrapper");
      if (wrapper) {
        wrapper.querySelectorAll(".resize-handle").forEach((h) => h.remove());
      }
    };

    // ✅ Wrap image for float + drag
    const wrapImage = (img) => {
      const wrapper = document.createElement("span");
      wrapper.className =
        "img-wrapper float-left relative align-top mx-2 my-1";
      wrapper.draggable = true;

      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      img.style.maxWidth = "100%";
      img.style.height = "auto";
      img.style.cursor = "pointer";
      img.style.display = "block";

      wrapper.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "");
        wrapper.classList.add("dragging");
      });

      wrapper.addEventListener("dragend", () => {
        wrapper.classList.remove("dragging");
      });

      return wrapper;
    };

    // ✅ Resize logic
    const initResize = (e, img) => {
      e.preventDefault();
      e.stopPropagation();

      startX = e.clientX;
      startWidth = img.offsetWidth;

      const doResize = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const newWidth = Math.max(50, startWidth + dx);
        img.style.width = `${newWidth}px`;
        img.style.height = "auto";
      };

      const stopResize = () => {
        document.removeEventListener("mousemove", doResize);
        document.removeEventListener("mouseup", stopResize);
      };

      document.addEventListener("mousemove", doResize);
      document.addEventListener("mouseup", stopResize);
    };

    // ✅ Add float controls (Left / Right buttons)
    const addFloatControls = (img) => {
      removeFloatControls(); // remove previous buttons

      const wrapper = img.closest(".img-wrapper");
      if (!wrapper) return;

      const controls = document.createElement("div");
      controls.className =
        "float-controls absolute top-1 right-1 flex gap-1 z-20";

      const leftBtn = document.createElement("button");
      leftBtn.innerText = "⬅️";
      leftBtn.title = "Float Left";
      leftBtn.className =
        "bg-white text-gray-800 border border-gray-300 rounded px-1 text-sm hover:bg-gray-100";
      leftBtn.onclick = (e) => {
        e.stopPropagation();
        wrapper.classList.remove("float-right");
        wrapper.classList.add("float-left");
      };

      const rightBtn = document.createElement("button");
      rightBtn.innerText = "➡️";
      rightBtn.title = "Float Right";
      rightBtn.className =
        "bg-white text-gray-800 border border-gray-300 rounded px-1 text-sm hover:bg-gray-100";
      rightBtn.onclick = (e) => {
        e.stopPropagation();
        wrapper.classList.remove("float-left");
        wrapper.classList.add("float-right");
      };

      controls.appendChild(leftBtn);
      controls.appendChild(rightBtn);
      wrapper.appendChild(controls);
    };

    // ✅ Remove control buttons
    const removeFloatControls = () => {
      document.querySelectorAll(".float-controls").forEach((c) => c.remove());
    };

    editor.addEventListener("click", handleClick);
    return () => {
      editor.removeEventListener("click", handleClick);
    };
  }, [editorRef]);

  return null;
};

export default ImageDragResizeHandler;
