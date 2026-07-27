"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AudioPlayer from "@/components/admin/AudioPlayer";

interface Audio {
  id: string;
  titleEn: string;
  titleBs: string;
  descriptionEn: string | null;
  descriptionBs: string | null;
  url: string | null;
  youtubeUrl: string | null;
  type: string | null;
  createdAt: string;
}

type AudioTab = "ruqya" | "lecture";

export default function AdminAudioPage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AudioTab>("ruqya");
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingEditId, setSavingEditId] = useState<string | null>(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleBs, setTitleBs] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBs, setDescriptionBs] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [editTitleEn, setEditTitleEn] = useState("");
  const [editTitleBs, setEditTitleBs] = useState("");
  const [editDescriptionEn, setEditDescriptionEn] = useState("");
  const [editDescriptionBs, setEditDescriptionBs] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchAudios = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const timer = window.setTimeout(() => {
        void fetchAudios();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [status, fetchAudios]);

  const handleUpload = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      if (!file && !youtubeUrl.trim()) {
        setError("Please select an audio file or provide a YouTube link");
        return;
      }

      setUploading(true);

      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (youtubeUrl.trim()) {
        formData.append("youtubeUrl", youtubeUrl.trim());
      }
      formData.append("titleEn", titleEn);
      formData.append("titleBs", titleBs);
      formData.append("type", activeTab);
      if (descriptionEn) {
        formData.append("descriptionEn", descriptionEn);
      }
      if (descriptionBs) {
        formData.append("descriptionBs", descriptionBs);
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
        setTitleEn("");
        setTitleBs("");
        setDescriptionEn("");
        setDescriptionBs("");
        setFile(null);
        setYoutubeUrl("");
        await fetchAudios();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [file, youtubeUrl, titleEn, titleBs, descriptionEn, descriptionBs, activeTab, fetchAudios],
  );

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

  const startEdit = useCallback((audio: Audio) => {
    setEditingId(audio.id);
    setEditTitleEn(audio.titleEn);
    setEditTitleBs(audio.titleBs);
    setEditDescriptionEn(audio.descriptionEn || "");
    setEditDescriptionBs(audio.descriptionBs || "");
    setEditFile(null);
    setEditYoutubeUrl(audio.youtubeUrl || "");
    setError(null);
    setSuccess(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setSavingEditId(null);
    setEditFile(null);
    setEditYoutubeUrl("");
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingId) return;

    setError(null);
    setSuccess(null);
    setSavingEditId(editingId);

    try {
      const formData = new FormData();
      formData.append("titleEn", editTitleEn);
      formData.append("titleBs", editTitleBs);
      formData.append("descriptionEn", editDescriptionEn);
      formData.append("descriptionBs", editDescriptionBs);
      formData.append("youtubeUrl", editYoutubeUrl);
      if (editFile) {
        formData.append("file", editFile);
      }

      const res = await fetch(`/api/admin/audio/${editingId}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || "Update failed");
      }

      setAudios((prev) => prev.map((audio) => (audio.id === editingId ? data.audio : audio)));
      setSuccess("Audio updated successfully.");
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingEditId(null);
    }
  }, [
    editingId,
    editTitleEn,
    editTitleBs,
    editDescriptionEn,
    editDescriptionBs,
    editFile,
    editYoutubeUrl,
    cancelEdit,
  ]);

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

  const filteredAudios = audios.filter((audio) =>
    activeTab === "lecture" ? audio.type === "lecture" : audio.type !== "lecture",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-gray-200 p-1 w-fit">
          <button
            onClick={() => setActiveTab("ruqya")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "ruqya" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Ruqya Audio
          </button>
          <button
            onClick={() => setActiveTab("lecture")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "lecture" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Educational Lectures
          </button>
        </div>

        {/* Upload Form */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            {activeTab === "lecture" ? "Upload New Lecture Audio" : "Upload New Ruqya Audio"}
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="English title"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title (Bosnian) *
                </label>
                <input
                  type="text"
                  value={titleBs}
                  onChange={(e) => setTitleBs(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Naslov na bosanskom"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description (English)
                </label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="English description (optional)"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description (Bosnian)
                </label>
                <textarea
                  value={descriptionBs}
                  onChange={(e) => setDescriptionBs(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Opis na bosanskom (opcionalno)"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Audio File {youtubeUrl.trim() ? "" : "*"}
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-600 file:hover:bg-indigo-100"
              />
              {file && (
                <p className="mt-1 text-xs text-gray-500">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="text-center text-xs text-gray-400">- or -</div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                YouTube Video Link {file ? "" : "*"}
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Provide either an audio file above or a YouTube link - only one is required.
              </p>
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
            <h2 className="text-lg font-medium text-gray-900">
              {activeTab === "lecture" ? "Lecture Library" : "Ruqya Audio Library"}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
            </div>
          ) : filteredAudios.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              {activeTab === "lecture"
                ? "No lecture audio yet. Upload your first lecture above."
                : "No ruqya audio yet. Upload your first audio above."}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAudios.map((audio) => (
                <div
                  key={audio.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    {editingId === audio.id ? (
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <input
                          type="text"
                          value={editTitleEn}
                          onChange={(e) => setEditTitleEn(e.target.value)}
                          placeholder="Title (English)"
                          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900"
                        />
                        <input
                          type="text"
                          value={editTitleBs}
                          onChange={(e) => setEditTitleBs(e.target.value)}
                          placeholder="Title (Bosnian)"
                          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900"
                        />
                        <textarea
                          value={editDescriptionEn}
                          onChange={(e) => setEditDescriptionEn(e.target.value)}
                          placeholder="Description (English)"
                          rows={2}
                          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900"
                        />
                        <textarea
                          value={editDescriptionBs}
                          onChange={(e) => setEditDescriptionBs(e.target.value)}
                          placeholder="Description (Bosnian)"
                          rows={2}
                          className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900"
                        />
                        <div className="md:col-span-2">
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900 file:mr-2 file:rounded-md file:border-0 file:bg-indigo-50 file:px-2 file:py-1 file:text-xs file:font-medium file:text-indigo-600"
                          />
                          {editFile && (
                            <p className="mt-1 text-xs text-gray-500">New file: {editFile.name}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <input
                            type="url"
                            value={editYoutubeUrl}
                            onChange={(e) => setEditYoutubeUrl(e.target.value)}
                            placeholder="YouTube link (https://www.youtube.com/watch?v=...)"
                            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-900"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {audio.titleEn}
                          </h4>
                          <span className="text-xs text-gray-400">|</span>
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {audio.titleBs}
                          </h4>
                          {audio.youtubeUrl && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-600">
                              YouTube
                            </span>
                          )}
                        </div>
                        {(audio.descriptionEn || audio.descriptionBs) && (
                          <div className="mt-0.5">
                            {audio.descriptionEn && (
                              <p className="text-xs text-gray-500 truncate">
                                {audio.descriptionEn}
                              </p>
                            )}
                            {audio.descriptionBs && (
                              <p className="text-xs text-gray-500 truncate">
                                {audio.descriptionBs}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(audio.createdAt).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {audio.url ? (
                      <AudioPlayer src={audio.url} />
                    ) : audio.youtubeUrl ? (
                      <a
                        href={audio.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 underline"
                      >
                        Watch on YouTube
                      </a>
                    ) : null}
                    {editingId === audio.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={savingEditId === audio.id}
                          className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                        >
                          {savingEditId === audio.id ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={savingEditId === audio.id}
                          className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(audio)}
                        className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(audio.id)}
                      disabled={deletingId === audio.id || savingEditId === audio.id}
                      className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
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
