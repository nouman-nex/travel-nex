import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-24 text-center">
      {/* Visual Element - Fixed Overlap */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Background "404" watermark */}
        <span className="text-[12rem] font-black text-slate-200/60 leading-none select-none md:text-[16rem]">
          404
        </span>

        {/* Foreground text positioned centrally over the 404 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl tracking-tight">
            Oops!
          </h1>
          <p className="text-xl font-medium text-slate-700 mt-1">
            Page not found
          </p>
        </div>
      </div>

      {/* Message */}
      <div className="mt-4 max-w-md">
        <p className="text-base text-slate-500 leading-relaxed">
          The page you’re looking for seems to have wandered off. It might have
          been moved, deleted, or maybe it never existed.
        </p>
      </div>

      {/* Call to Action - Fixed Button Sizing */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <a
          href="/"
          className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Go back home
        </a>
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all active:scale-95"
        >
          Previous page
        </button>
      </div>

      {/* Footer Icon */}
      <div className="mt-16 animate-pulse">
        <svg
          className="h-16 w-16 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  );
}
