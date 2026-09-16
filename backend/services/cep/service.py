import re

from services.cep.providers import brasilapi


class CepLookupError(Exception):
    """Safe, provider-neutral CEP lookup failure."""


def normalize_cep(value: str) -> str:
    digits = re.sub(r"\D", "", str(value or ""))
    if len(digits) != 8:
        raise CepLookupError("Informe um CEP com 8 dígitos.")
    return digits


def lookup_cep(value: str) -> dict[str, str]:
    try:
        digits = normalize_cep(value)
        return brasilapi.lookup(digits)
    except brasilapi.CepProviderError as exc:
        raise CepLookupError(str(exc)) from exc
