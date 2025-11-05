export function Section({ title, children }){
  return <section className="section"><div className="container"><h2 className="section-title">{title}</h2>{children}</div></section>
}
