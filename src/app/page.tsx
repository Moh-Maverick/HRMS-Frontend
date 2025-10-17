import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center gap-8 animate-fadeIn text-center px-6">
      <h1 className="text-4xl md:text-6xl font-semibold text-primary">FWC HR Management System</h1>
      <p className="text-base md:text-lg text-gray-600 max-w-2xl">
        Streamline hiring, onboarding, attendance, payroll, and AI-assisted evaluations with a clean and responsive UI.
      </p>
      <div className="flex gap-4">
        <Link href="/auth/login" className="px-5 py-3 rounded-md bg-primary text-white hover:bg-accent transition-colors shadow">
          Login
        </Link>
        <Link href="/auth/signup" className="px-5 py-3 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors">
          Signup
        </Link>
      </div>
    </main>
  );
}
