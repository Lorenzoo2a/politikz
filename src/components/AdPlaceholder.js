export default function AdPlaceholder({ format = 'banner', className = '' }) {
  const sizes = {
    banner: 'h-[90px]',
    rectangle: 'h-[250px]',
    square: 'h-[250px] w-[300px]',
    leaderboard: 'h-[90px]',
    billboard: 'h-[250px] w-full',
    skyscraper: 'h-[600px] w-full',
    halfpage: 'h-[300px] w-full',
  }

  const labels = {
    skyscraper: '160×600',
    rectangle: '300×250',
    billboard: '970×250',
    halfpage: '300×300',
    banner: '728×90',
    leaderboard: '728×90',
    square: '300×250',
  }

  return (
    <div className={`ad-placeholder ${sizes[format] || sizes.banner} w-full ${className}`}>
      <div className="text-center">
        <span className="text-white/15 text-[10px] uppercase tracking-widest font-medium block mb-1">Annonce</span>
        <span className="text-white/10 text-[9px]">{labels[format] || '728×90'}</span>
      </div>
    </div>
  )
}
