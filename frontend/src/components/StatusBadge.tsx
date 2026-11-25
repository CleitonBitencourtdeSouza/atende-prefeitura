import type { Status } from '../api'

// A "etiqueta colorida" que mostra o status do chamado.
const classes: Record<Status, string> = {
  Aberto: 'badge badge-aberto',
  'Em andamento': 'badge badge-andamento',
  Resolvido: 'badge badge-resolvido',
}

export function StatusBadge({ status }: { status: Status }) {
  return <span className={classes[status]}>{status}</span>
}
