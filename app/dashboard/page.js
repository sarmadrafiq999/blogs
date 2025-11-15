'use client';

import { useUser } from '@clerk/nextjs';
import { RedirectToSignIn } from '@clerk/nextjs';

export default function DashboardPage() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.firstName} 👋</h1>
      <p className="text-lg">This is your dashboard page.</p>
    </main>
  );
}
