// components/ConfirmModal.jsx
"use client";

import React from "react";

export default function ConfirmModal({ type, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Confirm {type === "all" ? "Delete All" : "Delete"}</h2>
        <p className="mb-6">
          Are you sure you want to {type === "all" ? "delete all blogs" : "delete this blog"}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {type === "all" ? "Delete All" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
