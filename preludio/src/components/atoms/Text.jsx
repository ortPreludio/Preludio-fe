export function Text({ children, muted=false, className='' }) {
  return <p className={`text ${muted ? 'text-muted' : ''} ${className}`}>{children}</p>
}
