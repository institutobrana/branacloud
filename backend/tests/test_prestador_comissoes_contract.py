from __future__ import annotations

import os
import sys
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-prestador-comissoes"

from database import Base  # noqa: E402
from models.model_registry import import_all_models  # noqa: E402
from models.clinica import Clinica  # noqa: E402
from models.convenio_odonto import ConvenioOdonto  # noqa: E402
from models.prestador_odonto import PrestadorComissaoOdonto, PrestadorOdonto  # noqa: E402
from models.procedimento_generico import ProcedimentoGenerico  # noqa: E402
from models.usuario import Usuario  # noqa: E402
from routes.prestadores_routes import (  # noqa: E402
    ComissaoPayload,
    _proximo_source_id,
    alterar_comissao,
    criar_comissao,
    excluir_comissao,
    listar_comissoes,
)


class PrestadorComissoesContractTests(unittest.TestCase):
    def setUp(self):
        import_all_models()
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        self.tables = [
            Clinica.__table__,
            Usuario.__table__,
            PrestadorOdonto.__table__,
            ConvenioOdonto.__table__,
            ProcedimentoGenerico.__table__,
            PrestadorComissaoOdonto.__table__,
        ]
        Base.metadata.create_all(bind=self.engine, tables=self.tables)
        self.db = sessionmaker(bind=self.engine)()
        now = datetime.utcnow() + timedelta(days=30)
        self.db.add_all(
            [
                Clinica(id=1, nome="Clinica A", email="a@test.local", trial_ate=now, ativo=True),
                Clinica(id=2, nome="Clinica B", email="b@test.local", trial_ate=now, ativo=True),
                Usuario(
                    id=1,
                    codigo=101,
                    nome="Usuario A",
                    apelido="A",
                    tipo_usuario="Admin",
                    email="a-user@test.local",
                    senha_hash="hash",
                    ativo=True,
                    online=True,
                    forcar_troca_senha=False,
                    setup_completed=True,
                    is_system_user=False,
                    is_admin=True,
                    clinica_id=1,
                ),
                Usuario(
                    id=2,
                    codigo=102,
                    nome="Usuario B",
                    apelido="B",
                    tipo_usuario="Admin",
                    email="b-user@test.local",
                    senha_hash="hash",
                    ativo=True,
                    online=True,
                    forcar_troca_senha=False,
                    setup_completed=True,
                    is_system_user=False,
                    is_admin=True,
                    clinica_id=2,
                ),
                ConvenioOdonto(id=1, clinica_id=1, source_id=11, nome="Convenio A", inativo=False),
                ConvenioOdonto(id=2, clinica_id=2, source_id=21, nome="Convenio B", inativo=False),
                ProcedimentoGenerico(id=1, clinica_id=1, codigo="A", descricao="Procedimento A"),
                ProcedimentoGenerico(id=2, clinica_id=2, codigo="B", descricao="Procedimento B"),
                PrestadorOdonto(
                    id=1,
                    clinica_id=1,
                    source_id=31,
                    codigo="001",
                    nome="Prestador A",
                    apelido="A",
                    inativo=False,
                    is_system_prestador=False,
                ),
                PrestadorOdonto(
                    id=2,
                    clinica_id=2,
                    source_id=41,
                    codigo="001",
                    nome="Prestador B",
                    apelido="B",
                    inativo=False,
                    is_system_prestador=False,
                ),
            ]
        )
        self.db.commit()
        self.user_a = SimpleNamespace(id=1, clinica_id=1, is_admin=True)
        self.user_b = SimpleNamespace(id=2, clinica_id=2, is_admin=True)

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(bind=self.engine, tables=list(reversed(self.tables)))
        self.engine.dispose()

    def payload(self, **overrides):
        data = {
            "vigencia": "23/08/2026",
            "prestador_row_id": 1,
            "convenio_row_id": 1,
            "especialidade_row_id": None,
            "especialidade": None,
            "procedimento_generico_id": None,
            "tipo_repasse_codigo": 1,
            "tipo_repasse": "% sobre valor",
            "repasse": "20",
        }
        data.update(overrides)
        return ComissaoPayload(**data)

    def create(self, user=None, **overrides):
        return criar_comissao(
            self.payload(**overrides),
            current_user=user or self.user_a,
            db=self.db,
        )

    def test_crud_comum_usa_id_e_isola_tenant(self):
        created = self.create()
        self.assertIsNotNone(created["id"])
        persisted = self.db.get(PrestadorComissaoOdonto, created["id"])
        self.assertIsNotNone(persisted.source_id)
        self.assertEqual(created["prestador_row_id"], 1)
        self.assertEqual(created["convenio_row_id"], 1)
        self.assertEqual(created["vigencia"], "23/08/2026")
        self.assertEqual(created["tipo_repasse_codigo"], 1)
        self.assertEqual(created["repasse"], "20")

        updated = alterar_comissao(
            created["id"], self.payload(repasse="21"), current_user=self.user_a, db=self.db
        )
        self.assertEqual(updated["id"], created["id"])
        self.assertEqual(updated["repasse"], "21")

        self.assertEqual(listar_comissoes(current_user=self.user_a, db=self.db)["itens"][0]["id"], created["id"])
        self.assertEqual(listar_comissoes(current_user=self.user_b, db=self.db)["itens"], [])
        with self.assertRaises(Exception):
            alterar_comissao(created["id"], self.payload(repasse="cross"), current_user=self.user_b, db=self.db)

        self.assertEqual(excluir_comissao(created["id"], current_user=self.user_a, db=self.db), {"ok": True})
        self.assertEqual(listar_comissoes(current_user=self.user_a, db=self.db)["itens"], [])

    def test_source_id_sequencial_por_clinica(self):
        first_a = self.create()
        second_a = self.create(repasse="21")
        first_b = self.create(user=self.user_b, convenio_row_id=2, prestador_row_id=2)
        second_b = self.create(user=self.user_b, convenio_row_id=2, prestador_row_id=2, repasse="22")

        self.assertEqual([first_a["id"], second_a["id"]], sorted([first_a["id"], second_a["id"]]))
        self.assertEqual([first_b["id"], second_b["id"]], sorted([first_b["id"], second_b["id"]]))
        self.assertEqual(self.db.get(PrestadorComissaoOdonto, first_a["id"]).source_id, 1)
        self.assertEqual(self.db.get(PrestadorComissaoOdonto, second_a["id"]).source_id, 2)
        self.assertEqual(self.db.get(PrestadorComissaoOdonto, first_b["id"]).source_id, 1)
        self.assertEqual(self.db.get(PrestadorComissaoOdonto, second_b["id"]).source_id, 2)

    def test_cross_tenant_post_put_delete_and_filters_are_blocked(self):
        factor_b = self.create(user=self.user_b, convenio_row_id=2, prestador_row_id=2, procedimento_generico_id=2)
        before = self.db.get(PrestadorComissaoOdonto, factor_b["id"])

        self.assertEqual(listar_comissoes(current_user=self.user_a, db=self.db)["itens"], [])
        self.assertEqual(
            listar_comissoes(prestador_row_id=2, current_user=self.user_a, db=self.db)["itens"], []
        )
        self.assertEqual(
            listar_comissoes(convenio_row_id=2, current_user=self.user_a, db=self.db)["itens"], []
        )
        self.assertEqual(
            listar_comissoes(prestador_row_id=0, current_user=self.user_b, db=self.db)["itens"], []
        )

        for overrides in (
            {"convenio_row_id": 2},
            {"prestador_row_id": 2},
            {"procedimento_generico_id": 2},
        ):
            with self.assertRaises(HTTPException) as failure:
                self.create(**overrides)
            self.assertEqual(failure.exception.status_code, 404)

        with self.assertRaises(HTTPException) as failure:
            alterar_comissao(factor_b["id"], self.payload(repasse="cross"), current_user=self.user_a, db=self.db)
        self.assertEqual(failure.exception.status_code, 404)
        with self.assertRaises(HTTPException) as failure:
            excluir_comissao(factor_b["id"], current_user=self.user_a, db=self.db)
        self.assertEqual(failure.exception.status_code, 404)

        self.db.refresh(before)
        self.assertEqual(before.repasse, "20")
        self.assertIsNotNone(self.db.get(PrestadorComissaoOdonto, factor_b["id"]))
        self.assertEqual(len(listar_comissoes(current_user=self.user_b, db=self.db)["itens"]), 1)
        updated_b = alterar_comissao(
            factor_b["id"],
            self.payload(prestador_row_id=2, convenio_row_id=2, procedimento_generico_id=2, repasse="abc"),
            current_user=self.user_b,
            db=self.db,
        )
        self.assertEqual(updated_b["repasse"], "abc")
        self.assertEqual(excluir_comissao(factor_b["id"], current_user=self.user_b, db=self.db), {"ok": True})

    def test_postgres_lock_precedes_source_query(self):
        calls = []

        class Dialect:
            name = "postgresql"

        class Bind:
            dialect = Dialect()

        class Query:
            def filter(self, *_args, **_kwargs):
                calls.append("query")
                return self

            def all(self):
                return []

        class Db:
            bind = Bind()

            def execute(self, statement, params):
                calls.append((str(statement), params))

            def query(self, _model):
                return Query()

        self.assertEqual(_proximo_source_id(Db(), PrestadorComissaoOdonto, 7), 1)
        self.assertEqual(calls[0][1], {"lock_key": (7 << 20) | 0xC011})
        self.assertEqual(calls[1], "query")

    def test_clinica_sentinel_zero_get_put_delete(self):
        created = self.create(prestador_row_id=0, repasse="0,00")
        persisted = self.db.get(PrestadorComissaoOdonto, created["id"])
        self.assertIsNone(persisted.prestador_id)
        self.assertIsNone(persisted.prestador_source_id)
        self.assertEqual(created["prestador_id"], -1)
        self.assertEqual(created["prestador_nome"], "Clínica")

        filtered = listar_comissoes(prestador_row_id=0, current_user=self.user_a, db=self.db)
        self.assertEqual([item["id"] for item in filtered["itens"]], [created["id"]])
        self.assertEqual(listar_comissoes(prestador_row_id=1, current_user=self.user_a, db=self.db)["itens"], [])

        updated = alterar_comissao(
            created["id"], self.payload(prestador_row_id=0, repasse="1,00"), current_user=self.user_a, db=self.db
        )
        persisted = self.db.get(PrestadorComissaoOdonto, created["id"])
        self.assertIsNone(persisted.prestador_id)
        self.assertIsNone(persisted.prestador_source_id)
        self.assertEqual(updated["prestador_id"], -1)
        self.assertEqual(updated["repasse"], "1,00")
        self.assertEqual(excluir_comissao(created["id"], current_user=self.user_a, db=self.db), {"ok": True})

    def test_vigencia_null_tipos_e_repasse_sao_preservados(self):
        created = self.create(vigencia=None, repasse="1")
        self.assertEqual(created["vigencia"], "")
        self.assertIsNone(self.db.get(PrestadorComissaoOdonto, created["id"]).vigencia)
        self.assertEqual(created["repasse"], "1")

        for value in ("1,5", "1,50", "10,00", "0", "-1", "100,01", "abc"):
            updated = alterar_comissao(
                created["id"], self.payload(vigencia=None, repasse=value), current_user=self.user_a, db=self.db
            )
            persisted = self.db.get(PrestadorComissaoOdonto, created["id"])
            self.assertEqual(updated["repasse"], value)
            self.assertEqual(persisted.repasse, value)
            self.assertIsNone(persisted.vigencia)

        fixed = alterar_comissao(
            created["id"],
            self.payload(tipo_repasse_codigo=2, tipo_repasse="Valor fixo", repasse="10,00"),
            current_user=self.user_a,
            db=self.db,
        )
        self.assertEqual(fixed["tipo_repasse_codigo"], 2)
        self.assertEqual(fixed["tipo_repasse"], "Valor fixo")
        self.assertEqual(fixed["repasse"], "10,00")
        excluir_comissao(created["id"], current_user=self.user_a, db=self.db)


if __name__ == "__main__":
    unittest.main()
