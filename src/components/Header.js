import Link from 'next/link'

export default function Header({ showShare = false, onShare }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-brand/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-accent-red p-1.5 rounded flex items-center justify-center transition-transform group-hover:scale-105">
          <span className="material-symbols-outlined text-white text-lg">account_balance</span>
        </div>
        <span className="text-white text-lg font-extrabold tracking-tighter uppercase">Politikz</span>
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
