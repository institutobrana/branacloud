import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace
import unittest

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-financeiro-prestador"

from database import Base
from models.model_registry import import_all_models
from models.clinica import Clinica
from models.financeiro import CategoriaFinanceira, GrupoFinanceiro, Lancamento
from models.prestador_odonto import PrestadorOdonto
from models.usuario import Usuario
from routes import financeiro_routes


class FinanceiroPrestadorContractTests(unittest.TestCase):
    def setUp(self):
        import_all_models()
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        Base.metadata.create_all(
            bind=self.engine,
            tables=[
                Clinica.__table__,
                Usuario.__table__,
                GrupoFinanceiro.__table__,
                CategoriaFinanceira.__table__,
                PrestadorOdonto.__table__,
                Lancamento.__table__,
            ],
        )
        self.SessionLocal = sessionmaker(bind=self.engine)
        self.db = self.SessionLocal()
        self.db.add_all(
            [
                Clinica(
                    id=1,
                    nome="Clinica A",
                    email="a@brana.com",
                    trial_ate=datetime.utcnow() + timedelta(days=30),
                    ativo=True,
                    nome_tabela_procedimentos="Tabela A",
                ),
                Clinica(
                    id=2,
                    nome="Clinica B",
                    email="b@brana.com",
                    trial_ate=datetime.utcnow() + timedelta(days=30),
                    ativo=True,
                    nome_tabela_procedimentos="Tabela B",
                ),
                Usuario(
                    id=1,
                    codigo=100,
                    nome="Usuario A",
                    apelido="A",
                    tipo_usuario="Admin",
                    email="user@a.com",
                    senha_hash="hash",
                    ativo=True,
                    online=True,
                    forcar_troca_senha=False,
                    setup_completed=True,
                    is_system_user=False,
                    is_admin=True,
                    clinica_id=1,
                ),
                GrupoFinanceiro(id=1, clinica_id=1, nome="Receitas", tipo="Entrada"),
                GrupoFinanceiro(id=2, clinica_id=1, nome="Despesas", tipo="Saida"),
                CategoriaFinanceira(id=1, clinica_id=1, grupo_id=1, nome="Consulta", tipo="Entrada", tributavel=False),
                CategoriaFinanceira(id=2, clinica_id=1, grupo_id=2, nome="Despesa", tipo="Saida", tributavel=False),
                CategoriaFinanceira(id=3, clinica_id=2, grupo_id=2, nome="Outra", tipo="Saida", tributavel=False),
                PrestadorOdonto(
                    id=1,
                    clinica_id=1,
                    source_id=11,
                    nome="Dr A",
                    inativo=False,
                    executa_procedimento=True,
                    is_system_prestador=False,
                ),
                PrestadorOdonto(
                    id=2,
                    clinica_id=1,
                    source_id=12,
                    nome="Dr B",
                    inativo=False,
                    executa_procedimento=True,
                    is_system_prestador=False,
                ),
                PrestadorOdonto(
                    id=3,
                    clinica_id=2,
                    source_id=21,
                    nome="Dr B2",
                    inativo=False,
                    executa_procedimento=True,
                    is_system_prestador=False,
                ),
            ]
        )
        self.db.commit()
        self.current_user = SimpleNamespace(id=1, clinica_id=1, is_admin=True)

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(
            bind=self.engine,
            tables=[
                Lancamento.__table__,
                PrestadorOdonto.__table__,
                CategoriaFinanceira.__table__,
                GrupoFinanceiro.__table__,
                Usuario.__table__,
                Clinica.__table__,
            ],
        )
        self.engine.dispose()

    def _novo_payload(self, **overrides):
        payload = {
            "categoria_id": 1,
            "historico": "Lancamento teste",
            "valor": 100.0,
            "tipo": "credito",
            "conta": "CLINICA",
            "situacao": "Aberto",
            "forma_pagamento": None,
            "documento": None,
            "referencia": None,
            "complemento": None,
            "tributavel": 0,
            "data_lancamento": "2026-08-01",
            "data_vencimento": "2026-08-01",
            "data_pagamento": None,
            "parcelas": 1,
            "prestador_id": None,
        }
        payload.update(overrides)
        return financeiro_routes.LancamentoPayload(**payload)

    def _seed_lancamento(self, **overrides):
        data = {
            "clinica_id": 1,
            "categoria_id": 1,
            "historico": "Hist",
            "valor": 100.0,
            "tipo": "credito",
            "conta": "CIRURGIAO",
            "situacao": "Aberto",
            "data_lancamento": "2026-08-01",
            "data_vencimento": "2026-08-01",
            "data_pagamento": "2026-08-01",
            "prestador_id": None,
        }
        data.update(overrides)
        lanc = Lancamento(**data)
        self.db.add(lanc)
        self.db.commit()
        self.db.refresh(lanc)
        return lanc

    def _assert_item(self, item, *, prestador_id, valor, conta="CIRURGIAO"):
        self.assertEqual(item["prestador_id"], prestador_id)
        self.assertEqual(item["valor"], valor)
        self.assertEqual(item["conta"], conta)

    def test_get_clinica_sem_prestador(self):
        self._seed_lancamento(conta="CLINICA", prestador_id=None, valor=50.0)
        result = financeiro_routes.listar_lancamentos(
            mes=8,
            ano=2026,
            conta="CLINICA",
            prestador_id=None,
            filtro="Todos os lancamentos",
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(len(result["itens"]), 1)
        self.assertIsNone(result["itens"][0]["prestador_id"])
        self.assertEqual(result["total_entrada"], 50.0)
        self.assertEqual(result["total_saida"], 0.0)

    def test_get_cirurgiao_legado_sem_prestador_id_continua_funcionando(self):
        self._seed_lancamento(conta="CIRURGIAO", prestador_id=None, valor=60.0)
        result = financeiro_routes.listar_lancamentos(
            mes=8,
            ano=2026,
            conta="CIRURGIAO",
            prestador_id=None,
            filtro="Todos os lancamentos",
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(len(result["itens"]), 1)
        self.assertIsNone(result["itens"][0]["prestador_id"])
        self.assertEqual(result["total_entrada"], 60.0)
        self.assertEqual(result["total_saida"], 0.0)

    def test_get_cirurgiao_filtra_por_prestador(self):
        self._seed_lancamento(conta="CIRURGIAO", prestador_id=1, valor=70.0)
        self._seed_lancamento(conta="CIRURGIAO", prestador_id=2, valor=30.0)
        result = financeiro_routes.listar_lancamentos(
            mes=8,
            ano=2026,
            conta="CIRURGIAO",
            prestador_id=1,
            filtro="Todos os lancamentos",
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(len(result["itens"]), 1)
        self._assert_item(result["itens"][0], prestador_id=1, valor=70.0)
        self.assertEqual(result["total_entrada"], 70.0)
        self.assertEqual(result["total_saida"], 0.0)

    def test_get_rejeita_prestador_de_outra_clinica(self):
        with self.assertRaises(HTTPException) as ctx:
            financeiro_routes.listar_lancamentos(
                mes=8,
                ano=2026,
                conta="CIRURGIAO",
                prestador_id=3,
                filtro="Todos os lancamentos",
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 404)

    def test_get_cirurgiao_filtra_e_isola_a1_a2(self):
        self._seed_lancamento(conta="CIRURGIAO", prestador_id=1, valor=11.0)
        self._seed_lancamento(conta="CIRURGIAO", prestador_id=1, valor=13.0)
        self._seed_lancamento(conta="CIRURGIAO", prestador_id=2, valor=17.0)
        result = financeiro_routes.listar_lancamentos(
            mes=8,
            ano=2026,
            conta="CIRURGIAO",
            prestador_id=1,
            filtro="Todos os lancamentos",
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual([item["prestador_id"] for item in result["itens"]], [1, 1])
        self.assertEqual([item["valor"] for item in result["itens"]], [11.0, 13.0])
        self.assertEqual(result["total_entrada"], 24.0)
        self.assertEqual(result["saldo"], 24.0)

    def test_get_cirurgiao_legacy_agregado_inclui_null_a1_a2(self):
        self._seed_lancamento(conta="CIRURGIAO", prestador_id=None, valor=5.0)
        self._seed_lancamento(conta="CIRURGIAO", prestador_id=1, valor=7.0)
        self._seed_lancamento(conta="CIRURGIAO", prestador_id=2, valor=9.0)
        result = financeiro_routes.listar_lancamentos(
            mes=8,
            ano=2026,
            conta="CIRURGIAO",
            prestador_id=None,
            filtro="Todos os lancamentos",
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual([item["prestador_id"] for item in result["itens"]], [None, 1, 2])
        self.assertEqual([item["valor"] for item in result["itens"]], [5.0, 7.0, 9.0])
        self.assertEqual(result["total_entrada"], 21.0)
        self.assertEqual(result["total_saida"], 0.0)

    def test_get_clinica_nao_mistura_prestador_id_incoerente(self):
        self._seed_lancamento(conta="CLINICA", prestador_id=None, valor=19.0)
        result = financeiro_routes.listar_lancamentos(
            mes=8,
            ano=2026,
            conta="CLINICA",
            prestador_id=None,
            filtro="Todos os lancamentos",
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(len(result["itens"]), 1)
        self.assertIsNone(result["itens"][0]["prestador_id"])
        self.assertEqual(result["total_entrada"], 19.0)
        self.assertEqual(result["saldo"], 19.0)

    def test_post_cirurgiao_persisted_with_prestador(self):
        result = financeiro_routes.criar_lancamento(
            payload=self._novo_payload(conta="CIRURGIAO", prestador_id=1),
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(result["detail"], "Lancamento salvo.")
        lanc = self.db.query(Lancamento).filter(Lancamento.clinica_id == 1).order_by(Lancamento.id.desc()).first()
        self.assertEqual(lanc.prestador_id, 1)
        self.assertEqual(lanc.conta, "CIRURGIAO")
        self.assertEqual(self.db.query(Lancamento).filter(Lancamento.prestador_id == 1).count(), 1)

    def test_post_clinica_rejeita_prestador(self):
        with self.assertRaises(HTTPException) as ctx:
            financeiro_routes.criar_lancamento(
                payload=self._novo_payload(conta="CLINICA", prestador_id=1),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 400)

    def test_put_preserva_legacy_null_and_accepts_valid_prestador(self):
        lanc = self._seed_lancamento(conta="CIRURGIAO", prestador_id=None)
        atualizado = financeiro_routes.atualizar_lancamento(
            lancamento_id=lanc.id,
            payload=self._novo_payload(conta="CIRURGIAO", prestador_id=1),
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual(atualizado["detail"], "Lancamento atualizado.")
        self.db.refresh(lanc)
        self.assertEqual(lanc.prestador_id, 1)
        self.assertEqual(lanc.conta, "CIRURGIAO")

    def test_put_rejeita_cross_tenant(self):
        lanc = self._seed_lancamento(conta="CIRURGIAO", prestador_id=None)
        with self.assertRaises(HTTPException) as ctx:
            financeiro_routes.atualizar_lancamento(
                lancamento_id=lanc.id,
                payload=self._novo_payload(conta="CIRURGIAO", prestador_id=3),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 404)

    def test_put_clinica_rejeita_prestador(self):
        lanc = self._seed_lancamento(conta="CLINICA", prestador_id=None)
        with self.assertRaises(HTTPException) as ctx:
            financeiro_routes.atualizar_lancamento(
                lancamento_id=lanc.id,
                payload=self._novo_payload(conta="CLINICA", prestador_id=1),
                current_user=self.current_user,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 400)

    def test_put_cirurgiao_isola_a1_e_preserva_b1_em_outro_lancamento(self):
        lanc_a1 = self._seed_lancamento(conta="CIRURGIAO", prestador_id=1, valor=31.0)
        lanc_a2 = self._seed_lancamento(conta="CIRURGIAO", prestador_id=2, valor=41.0)
        financeiro_routes.atualizar_lancamento(
            lancamento_id=lanc_a1.id,
            payload=self._novo_payload(conta="CIRURGIAO", prestador_id=1, valor=33.0),
            current_user=self.current_user,
            db=self.db,
        )
        self.db.refresh(lanc_a1)
        self.db.refresh(lanc_a2)
        self.assertEqual(lanc_a1.prestador_id, 1)
        self.assertEqual(lanc_a2.prestador_id, 2)
        self.assertEqual(lanc_a1.valor, 33.0)
        result = financeiro_routes.listar_lancamentos(
            mes=8,
            ano=2026,
            conta="CIRURGIAO",
            prestador_id=1,
            filtro="Todos os lancamentos",
            current_user=self.current_user,
            db=self.db,
        )
        self.assertEqual([item["prestador_id"] for item in result["itens"]], [1])
        self.assertEqual([item["valor"] for item in result["itens"]], [33.0])


if __name__ == "__main__":
    unittest.main()
