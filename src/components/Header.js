import Link from 'next/link'

export default function Header({ showShare = false, onShare }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-brand/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <Link href="/" className="flex items-center group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt="Politikz"
          className="h-9 w-auto transition-opacity group-hover:opacity-80"
        />
      </Link>
      {showShare && (
        <button
          onClick={onShare}
          className="flex items-center justify-center rounded-lg h-9 w-9 bg-white/10 text-white hover:bg-white/15 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
      )}
    </header>
  )
}
