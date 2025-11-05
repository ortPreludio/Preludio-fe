export function Button({ children, variant='primary', as='a', href='#', disabled=false, onClick, type }){
  const className = `btn btn-${variant} ${disabled ? 'btn-disabled' : ''}`
  if (as === 'a'){
    return <a className={className} href={disabled ? undefined : href} onClick={onClick} aria-disabled={disabled}>{children}</a>
  }
  return <button className={className} onClick={onClick} disabled={disabled} type={type || 'button'}>{children}</button>
}
