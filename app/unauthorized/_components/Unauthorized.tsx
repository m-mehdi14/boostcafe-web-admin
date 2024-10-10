"use client";

import { useRouter } from "next/navigation";
import React from "react";

export const Unauthorized = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">Unauthorized</h1>
        <p className="mt-4 text-lg">
          You do not have permission to view this page.
        </p>
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => router.push("/")}
        >
          Go to Home
        </button>
      </div>
    </>
  );
};
