"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="workspace" role="alert">
      <h1>Something interrupted that request.</h1>
      <p>Your action may not have completed. Please try again.</p>
      <button className="btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
