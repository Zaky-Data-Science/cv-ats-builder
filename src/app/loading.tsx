/**
 * Tampilan sementara saat halaman sedang disiapkan server.
 *
 * Memakai kerangka bentuk (skeleton), bukan pemutar berputar, karena bentuk
 * yang menyerupai isi halaman membuat perpindahan terasa lebih singkat dan
 * tidak menimbulkan lompatan tata letak saat isinya muncul.
 */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8" aria-busy="true">
      <span className="sr-only">Memuat halaman...</span>

      <div className="h-8 w-48 animate-pulse rounded-lg bg-ink-200" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded bg-ink-200" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="rounded-xl border border-ink-200 bg-white p-5"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-ink-200" />
            <div className="mt-2 h-3 w-44 animate-pulse rounded bg-ink-100" />
            <div className="mt-6 h-9 w-full animate-pulse rounded-lg bg-ink-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
