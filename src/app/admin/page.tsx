import { auth } from "@/lib/auth";
import { LoginButton } from "@/components/login-button";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Welcome</h2>
        <p className="mt-2 text-gray-600">
          This is the admin panel. Build your admin features here.
        </p>
      </div>
    </main>
  );
}
