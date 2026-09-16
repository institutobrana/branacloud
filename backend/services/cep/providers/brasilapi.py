import requests


class CepProviderError(Exception):
    """Expected provider failure that can be shown safely to the API client."""


def _format_cep(value: object) -> str:
    digits = "".join(character for character in str(value or "") if character.isdigit())
    return f"{digits[:5]}-{digits[5:]}" if len(digits) == 8 else str(value or "").strip()


def lookup(cep: str, timeout: float = 4.0) -> dict[str, str]:
    try:
        response = requests.get(
            f"https://brasilapi.com.br/api/cep/v2/{cep}",
            timeout=timeout,
        )
    except requests.Timeout as exc:
        raise CepProviderError("O serviço de CEP demorou para responder.") from exc
    except requests.RequestException as exc:
        raise CepProviderError("Não foi possível consultar o serviço de CEP.") from exc

    if response.status_code == 404:
        raise CepProviderError("CEP não encontrado.")
    if response.status_code >= 400:
        raise CepProviderError("O serviço de CEP não está disponível.")

    try:
        data = response.json()
    except ValueError as exc:
        raise CepProviderError("O serviço de CEP retornou uma resposta inválida.") from exc
    if not isinstance(data, dict):
        raise CepProviderError("O serviço de CEP retornou uma resposta inválida.")

    return {
        "cep": _format_cep(data.get("cep")),
        "endereco": str(data.get("street") or "").strip(),
        "bairro": str(data.get("neighborhood") or "").strip(),
        "cidade": str(data.get("city") or "").strip(),
        "uf": str(data.get("state") or "").strip(),
    }
