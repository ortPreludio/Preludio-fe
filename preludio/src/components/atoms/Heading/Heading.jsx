export function Heading({ level=2, children, className='' }) {
  const Tag = `h${level}`
  return <Tag className={`heading h${level} ${className}`}>{children}</Tag>
}
