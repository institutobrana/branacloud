export function formatInteger(value) {
  if (value === null || value === undefined || value === "") return "?";
  const number = Number(value);
  if (!Number.isFinite(number)) return "?";
  return new Intl.NumberFormat("pt-BR").format(number);
}

export function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "?";
  const number = Number(value);
  if (!Number.isFinite(number)) return "?";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(number);
}

export function formatLastAccess(value, hasField = true) {
  if (!hasField) return "Não disponível";
  if (value === null || value === undefined || value === "") return "Não registrado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não registrado";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  }).format(date).replace(",", "");
}
