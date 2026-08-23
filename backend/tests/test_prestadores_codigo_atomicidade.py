from __future__ import annotations

import os
import sys
import threading
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from types import SimpleNamespace
import unittest

from sqlalchemy import func

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-prestadores-atomicidade")

from database import SessionLocal
from models.clinica import Clinica
from models.model_registry import import_all_models
from models.prestador_odonto import PrestadorOdonto
from routes import prestadores_routes


def _parse_codigo(value: str | None) -> int | None:
    code = str(value or "").strip()
    if not code.isdigit():
        return None
    return int(code)


class PrestadoresCodigoAtomicidadeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import_all_models()

    def setUp(self):
        self.db = SessionLocal()
        clinic_ids = [
            int(row[0])
            for row in self.db.query(Clinica.id).order_by(Clinica.id.asc()).limit(2).all()
        ]
        if len(clinic_ids) < 2:
            self.skipTest("sao necessarias ao menos duas clinicas para validar concorrencia e cross-tenant.")
        self.clinica_a, self.clinica_b = clinic_ids[:2]
        self.cleanup_prefixes = []

    def tearDown(self):
        try:
            for prefix in self.cleanup_prefixes:
                (
                    self.db.query(PrestadorOdonto)
                    .filter(
                        PrestadorOdonto.nome.like(f"{prefix}%"),
                        PrestadorOdonto.clinica_id.in_([self.clinica_a, self.clinica_b]),
                    )
                    .delete(synchronize_session=False)
                )
            self.db.commit()
        finally:
            self.db.close()

    def _max_codigo(self, clinica_id: int) -> int:
        rows = (
            self.db.query(PrestadorOdonto.codigo)
            .filter(PrestadorOdonto.clinica_id == int(clinica_id))
            .all()
        )
        max_value = 0
        for (codigo,) in rows:
            parsed = _parse_codigo(codigo)
            if parsed is not None:
                max_value = max(max_value, parsed)
        return max_value

    def _create_prestador(self, clinica_id: int, nome: str):
        session = SessionLocal()
        try:
            payload = prestadores_routes.PrestadorPayload(nome=nome, tipo_prestador="Cirurgião dentista")
            return prestadores_routes.criar_prestador(
                payload=payload,
                current_user=SimpleNamespace(clinica_id=clinica_id),
                db=session,
            )
        finally:
            session.close()

    def test_criacao_concorrente_gera_codigos_distintos_na_mesma_clinica(self):
        prefix = "TESTE ATOMICO CLINICA A"
        self.cleanup_prefixes.append(prefix)
        base_max = self._max_codigo(self.clinica_a)
        expected = [
            str(base_max + 1).zfill(max(3, len(str(base_max + 1)))),
            str(base_max + 2).zfill(max(3, len(str(base_max + 2)))),
        ]
        barrier = threading.Barrier(2)

        def worker(suffix: str):
            session = SessionLocal()
            try:
                payload = prestadores_routes.PrestadorPayload(
                    nome=f"{prefix} {suffix}",
                    tipo_prestador="Cirurgião dentista",
                )
                barrier.wait(timeout=10)
                return prestadores_routes.criar_prestador(
                    payload=payload,
                    current_user=SimpleNamespace(clinica_id=self.clinica_a),
                    db=session,
                )
            finally:
                session.close()

        with ThreadPoolExecutor(max_workers=2) as executor:
            future_a = executor.submit(worker, "A")
            future_b = executor.submit(worker, "B")
            result_a = future_a.result(timeout=20)
            result_b = future_b.result(timeout=20)

        codes = sorted([result_a["codigo"], result_b["codigo"]])
        self.assertEqual(codes, sorted(expected))
        self.assertNotEqual(result_a["codigo"], result_b["codigo"])

        rows = (
            self.db.query(PrestadorOdonto)
            .filter(PrestadorOdonto.clinica_id == self.clinica_a, PrestadorOdonto.nome.like(f"{prefix}%"))
            .order_by(PrestadorOdonto.codigo.asc(), PrestadorOdonto.id.asc())
            .all()
        )
        self.assertEqual([row.codigo for row in rows], expected)

    def test_sequencia_nao_vaza_entre_clinicas(self):
        prefix = "TESTE ATOMICO CROSS"
        self.cleanup_prefixes.append(prefix)
        base_a = self._max_codigo(self.clinica_a)
        base_b = self._max_codigo(self.clinica_b)

        result_a = self._create_prestador(self.clinica_a, f"{prefix} A")
        result_b = self._create_prestador(self.clinica_b, f"{prefix} B")

        self.assertEqual(
            result_a["codigo"],
            str(base_a + 1).zfill(max(3, len(str(base_a + 1)))),
        )
        self.assertEqual(
            result_b["codigo"],
            str(base_b + 1).zfill(max(3, len(str(base_b + 1)))),
        )


if __name__ == "__main__":
    unittest.main()
