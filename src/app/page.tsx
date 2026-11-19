import { Navbar } from '@/components/dashboard/Navbar';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export default function Home() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardClient />
      </main>
    </div>
  );
}
