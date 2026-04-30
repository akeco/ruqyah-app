"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Lecture {
  id: string;
  titleEn: string;
  titleBs: string;
  descriptionEn: string | null;
  descriptionBs: string | null;
  imageUrl: string;
  createdAt: string;
}

export default function AdminLecturesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleBs, setTitleBs] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBs, setDescriptionBs] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchLectures = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/lectures");
      if (!res.ok) throw new Error("Failed to load lectures");
      const data = await res.json();
      setLectures(data.lectures || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lectures");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user) {
      const timer = window.setTimeout(() => {
        void fetchLectures();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [status, session, router, fetchLectures]);

  const handleCreateLecture = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      if (!image) {
        setError("Please select a lecture image");
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("titleEn", titleEn);
        formData.append("titleBs", titleBs);
        formData.append("descriptionEn", descriptionEn);
        formData.append("descriptionBs", descriptionBs);

        const res = await fetch("/api/admin/lecture/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.details || data.error || "Failed to create lecture");
        }

        setSuccess("Lecture added successfully.");
        setTitleEn("");
        setTitleBs("");
        setDescriptionEn("");
        setDescriptionBs("");
        setImage(null);
        await fetchLectures();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create lecture");
      } finally {
        setUploading(false);
      }
    },
    [image, titleEn, titleBs, descriptionEn, descriptionBs, fetchLectures],
  );

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this lecture?")) return;

    setDeletingId(id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/lecture/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete lecture");
      }

      setLectures((prev) => prev.filter((lecture) => lecture.id !== id));
      setSuccess("Lecture deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lecture");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const handleEdit = useCallback((lecture: Lecture) => {
    setEditingId(lecture.id);
    setTitleEn(lecture.titleEn);
    setTitleBs(lecture.titleBs);
    setDescriptionEn(lecture.descriptionEn || "");
    setDescriptionBs(lecture.descriptionBs || "");
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setTitleEn("");
    setTitleBs("");
    setDescriptionEn("");
    setDescriptionBs("");
    setImage(null);
  }, []);

  const handleUpdateLecture = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      if (!editingId) return;

      setUploading(true);
      try {
        const formData = new FormData();
        if (image) {
          formData.append("image", image);
        }
        formData.append("titleEn", titleEn);
        formData.append("titleBs", titleBs);
        formData.append("descriptionEn", descriptionEn);
        formData.append("descriptionBs", descriptionBs);

        const res = await fetch(`/api/admin/lecture/${editingId}`, {
          method: "PUT",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.details || data.error || "Failed to update lecture");
        }

        setSuccess("Lecture updated successfully.");
        setEditingId(null);
        setTitleEn("");
        setTitleBs("");
        setDescriptionEn("");
        setDescriptionBs("");
        setImage(null);
        await fetchLectures();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update lecture");
      } finally {
        setUploading(false);
      }
    },
    [editingId, image, titleEn, titleBs, descriptionEn, descriptionBs, fetchLectures],
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            {editingId ? "Edit Lecture" : "Add New Lecture"}
          </h2>
          <form
            onSubmit={editingId ? handleUpdateLecture : handleCreateLecture}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
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
                  placeholder="Enter English title"
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
                  placeholder="Unesite naslov na bosanskom"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description (English)
                </label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter English description"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description (Bosnian)
                </label>
                <textarea
                  value={descriptionBs}
                  onChange={(e) => setDescriptionBs(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Unesite opis na bosanskom"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Lecture Image *
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-600 file:hover:bg-indigo-100"
              />
              {image && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Selected: {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="mt-2 h-20 w-32 rounded-md object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Saving..." : editingId ? "Update Lecture" : "Add Lecture"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={uploading}
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

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

        <div className="rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">Lectures</h2>
          </div>

          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading lectures...</div>
          ) : lectures.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No lectures yet. Add your first lecture above.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {lectures.map((lecture) => (
                <div key={lecture.id} className="flex items-start justify-between gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {lecture.titleEn} / {lecture.titleBs}
                    </h3>
                    {(lecture.descriptionEn || lecture.descriptionBs) && (
                      <p className="mt-1 text-sm text-gray-600">
                        {lecture.descriptionEn || "-"} | {lecture.descriptionBs || "-"}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(lecture.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      onClick={() => handleEdit(lecture)}
                      className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <img
                      src={lecture.imageUrl}
                      alt={lecture.titleEn}
                      className="h-16 w-24 rounded-md object-cover"
                    />
                    <button
                      onClick={() => handleDelete(lecture.id)}
                      disabled={deletingId === lecture.id}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {deletingId === lecture.id ? "Deleting..." : "Delete"}
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
