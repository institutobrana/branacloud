import requests


class CepProviderError(Exception):
    """Expected provider failure that can be shown safely to the API client."""


def lookup(cep: str, timeout: float = 4.0) -> dict[str, str]:
    try:
        response = requests.get(f"https://viacep.com.br/ws/{cep}/json/", timeout=timeout)
    except requests.Timeout as exc:
        raise CepProviderError("O serviço de CEP demorou para responder.") from exc
    except requests.RequestException as exc:
        raise CepProviderError("Não foi possível consultar o serviço de CEP.") from exc

    if response.status_code >= 400:
        raise CepProviderError("O serviço de CEP não está disponível.")
    try:
        data = response.json()
    except ValueError as exc:
        raise CepProviderError("O serviço de CEP retornou uma resposta inválida.") from exc
    if not isinstance(data, dict):
        raise CepProviderError("O serviço de CEP retornou uma resposta inválida.")
    if data.get("erro") is True:
        raise CepProviderError("CEP não encontrado.")

    return {
        "cep": str(data.get("cep") or "").strip(),
        "endereco": str(data.get("logradouro") or "").strip(),
        "bairro": str(data.get("bairro") or "").strip(),
        "cidade": str(data.get("localidade") or "").strip(),
        "uf": str(data.get("uf") or "").strip(),
    }
