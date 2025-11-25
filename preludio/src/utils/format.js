const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
export function formatDateISOToLong(dateISO) {
  try {
    const d = new Date(dateISO)
    if (isNaN(d)) return ''
    const day = d.getDate()
    const month = MONTHS_ES[d.getMonth()]
    const year = d.getFullYear()
    return `${day} ${month} ${year}`
  } catch { return '' }
}
