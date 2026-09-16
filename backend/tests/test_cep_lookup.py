import pytest

from fastapi import HTTPException
from routes import cadastros_routes
from services.cep.providers import brasilapi
from services.cep.service import CepLookupError, lookup_cep


class FakeResponse:
    def __init__(self, status_code=200, payload=None):
        self.status_code = status_code
        self.payload = payload

    def json(self):
        if isinstance(self.payload, Exception):
            raise self.payload
        return self.payload


def test_lookup_normalizes_complete_response(monkeypatch):
    monkeypatch.setattr(brasilapi.requests, 'get', lambda *args, **kwargs: FakeResponse(payload={
        'cep': '15041-591', 'street': 'Rua Teste', 'neighborhood': 'Centro',
        'city': 'São José do Rio Preto', 'state': 'SP', 'complemento': 'ignored',
    }))
    assert lookup_cep('15041591') == {
        'cep': '15041-591', 'endereco': 'Rua Teste', 'bairro': 'Centro',
        'cidade': 'São José do Rio Preto', 'uf': 'SP',
    }


def test_invalid_length_does_not_call_provider(monkeypatch):
    called = False

    def fail(*args, **kwargs):
        nonlocal called
        called = True

    monkeypatch.setattr(brasilapi.requests, 'get', fail)
    with pytest.raises(CepLookupError, match='8 dígitos'):
        lookup_cep('15041')
    assert called is False


def test_not_found_is_translated(monkeypatch):
    monkeypatch.setattr(brasilapi.requests, 'get', lambda *args, **kwargs: FakeResponse(status_code=404, payload={}))
    with pytest.raises(CepLookupError, match='não encontrado'):
        lookup_cep('99999999')


def test_timeout_is_translated(monkeypatch):
    def timeout(*args, **kwargs):
        raise brasilapi.requests.Timeout()

    monkeypatch.setattr(brasilapi.requests, 'get', timeout)
    with pytest.raises(CepLookupError, match='demorou'):
        lookup_cep('15041591')


def test_http_error_and_invalid_json_are_translated(monkeypatch):
    monkeypatch.setattr(brasilapi.requests, 'get', lambda *args, **kwargs: FakeResponse(status_code=503, payload={}))
    with pytest.raises(CepLookupError, match='disponível'):
        lookup_cep('15041591')
    monkeypatch.setattr(brasilapi.requests, 'get', lambda *args, **kwargs: FakeResponse(payload=ValueError()))
    with pytest.raises(CepLookupError, match='resposta inválida'):
        lookup_cep('15041591')


def test_incomplete_valid_response_returns_empty_strings(monkeypatch):
    monkeypatch.setattr(brasilapi.requests, 'get', lambda *args, **kwargs: FakeResponse(payload={'cep': '15041591', 'state': 'SP'}))
    assert lookup_cep('15041591') == {'cep': '15041591', 'endereco': '', 'bairro': '', 'cidade': '', 'uf': 'SP'}


def test_municipality_cep_allows_empty_street_and_neighborhood(monkeypatch):
    monkeypatch.setattr(brasilapi.requests, 'get', lambda *args, **kwargs: FakeResponse(payload={
        'cep': '14750-000', 'street': '', 'neighborhood': '',
        'city': 'Pitangueiras', 'state': 'SP',
    }))
    assert lookup_cep('14750000') == {
        'cep': '14750-000', 'endereco': '', 'bairro': '',
        'cidade': 'Pitangueiras', 'uf': 'SP',
    }


def test_route_translates_service_error(monkeypatch):
    monkeypatch.setattr(cadastros_routes, 'lookup_cep', lambda value: (_ for _ in ()).throw(CepLookupError('CEP não encontrado.')))
    with pytest.raises(HTTPException) as error:
        cadastros_routes.consultar_cep('99999999', None)
    assert error.value.status_code == 422
