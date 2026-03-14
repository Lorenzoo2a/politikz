'use client'

export default function ManageCookiesButton() {
  function handleClick() {
    localStorage.removeItem('politikz_cookie_consent')
    window.dispatchEvent(new Event('show-cookie-banner'))
  }

  return (
    <button
      onClick={handleClick}
      className="text-[10px] hover:text-white transition-colors"
    >
      Gérer les cookies
    </button>
  )
}
