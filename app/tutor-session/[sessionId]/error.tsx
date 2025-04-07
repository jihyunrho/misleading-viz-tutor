"use client";

export default function SessionError({ error }: { error: Error }) {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="text-center text-red-600">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2">{error.message}</p>
      </div>
    </main>
  );
}
