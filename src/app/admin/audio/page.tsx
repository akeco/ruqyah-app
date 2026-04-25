"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Audio {
  id: string;
  title: string;
  description: string | null;
  url: string;
  createdAt: string;
}

export default function AdminAudioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchAudios();
    }
  }, [status, router]);

  const fetchAudios = async () => {
    try {
      const res = await fetch("/api/admin/audios");
      if (res.ok) {
        const data = await res.json();
        setAudios(data.audios);
      }
    } catch (err) {
      console.error("Failed to fetch audios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    if (description) {
      formData.append("description", description);
    }

    try {
      const res = await fetch("/api/admin/audio/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess("Audio uploaded successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
      await fetchAudios();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [file, title, description, fetchAudios]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this audio?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/audio/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }

      setAudios((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Audio Management</h1>
          <p className="text-sm text-gray-600">Upload and manage audio files</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Upload Form */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Upload New Audio</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter audio title"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter description (optional)"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Audio File *
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-600 file:hover:bg-indigo-100"
              />
              {file && (
                <p className="mt-1 text-xs text-gray-500">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Audio"}
            </button>
          </form>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Audio List */}
        <div className="rounded-lg bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Audio Library</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
            </div>
          ) : audios.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No audio files yet. Upload your first audio above.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {audios.map((audio) => (
                <div key={audio.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{audio.title}</h3>
                    {audio.description && (
                      <p className="text-sm text-gray-500 truncate">{audio.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(audio.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-3 flex-shrink-0">
                    <audio
                      src={audio.url}
                      controls
                      className="h-8 w-auto max-w-[200px]"
                    >
                      Your browser does not support the audio element.
                    </audio>
                    <button
                      onClick={() => handleDelete(audio.id)}
                      disabled={deletingId === audio.id}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === audio.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
