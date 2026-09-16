from __future__ import annotations

import csv
import json
import os
from datetime import datetime, timezone
from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from dotenv import load_dotenv

load_dotenv(BACKEND_DIR / ".env")
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-for-symbols-tests")

from sqlalchemy import create_engine, text

SNAPSHOT_PATH = BACKEND_DIR / "scripts" / "easy_simbolos_catalogo_atual_snapshot.json"
from seeds.simbolos_graficos import SIMBOLOS_GRAFICOS_PADRAO
from services.simbolos_graficos_origem_classifier import (
    ORIGEM_ASSET_AUXILIAR,
    ORIGEM_CATALOGO_OFICIAL,
    ORIGEM_FIXTURE_TESTE,
    ORIGEM_INDEFINIDO,
    ORIGEM_SEED_INTERNO,
    construir_assinaturas_referencia,
    classificar_simbolo_grafico_dry_run,
    preparar_conjuntos_classificacao,
)


REPORT_DIR = Path("docs") / "audits"
REPORT_DIR.mkdir(parents=True, exist_ok=True)


def _coletar_registros_banco() -> list[dict[str, object]]:
    engine = create_engine(os.environ["DATABASE_URL"])
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                """
                SELECT id, clinica_id, legacy_id, origem, codigo, descricao, especialidade, tipo_marca,
                       tipo_simbolo, bitmap1, bitmap2, bitmap3, icone, imagem_custom, sobreposicao, ativo
                  FROM simbolo_grafico_catalogo
                 ORDER BY id
                """
            )
        ).mappings().all()
    return [dict(row) for row in rows]


def executar_dry_run() -> dict[str, object]:
    registros = _coletar_registros_banco()
    snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
    codigos_catalogo_oficial, legacy_ids_catalogo_oficial, codigos_seed_interno = preparar_conjuntos_classificacao(
        snapshot,
        SIMBOLOS_GRAFICOS_PADRAO,
    )
    assinatura_catalogo, assinatura_seed = construir_assinaturas_referencia(
        snapshot,
        SIMBOLOS_GRAFICOS_PADRAO,
    )

    resultados = [
        classificar_simbolo_grafico_dry_run(
            registro,
            assinaturas_catalogo_oficial=assinatura_catalogo,
            assinaturas_seed_interno=assinatura_seed,
        ).to_dict()
        for registro in registros
    ]

    totais = {
        ORIGEM_CATALOGO_OFICIAL: sum(1 for item in resultados if item["categoria_proposta"] == ORIGEM_CATALOGO_OFICIAL),
        ORIGEM_SEED_INTERNO: sum(1 for item in resultados if item["categoria_proposta"] == ORIGEM_SEED_INTERNO),
        ORIGEM_FIXTURE_TESTE: sum(1 for item in resultados if item["categoria_proposta"] == ORIGEM_FIXTURE_TESTE),
        ORIGEM_ASSET_AUXILIAR: sum(1 for item in resultados if item["categoria_proposta"] == ORIGEM_ASSET_AUXILIAR),
        ORIGEM_INDEFINIDO: sum(1 for item in resultados if item["categoria_proposta"] == ORIGEM_INDEFINIDO),
        "conflitos": sum(1 for item in resultados if item["conflito"]),
        "registros": len(resultados),
    }

    payload = {
        "fase": "G.2B.1B",
        "executado_em_utc": datetime.now(timezone.utc).isoformat(),
        "somente_leitura": True,
        "origem_persistida": False,
        "totais": totais,
        "resultados": resultados,
    }
    return payload


def salvar_relatorios(payload: dict[str, object]) -> tuple[Path, Path]:
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    json_path = REPORT_DIR / f"g2b1b_dry_run_origem_simbolos_{stamp}.json"
    csv_path = REPORT_DIR / f"g2b1b_dry_run_origem_simbolos_{stamp}.csv"

    json_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    resultados = payload["resultados"]
    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "simbolo_id",
                "codigo",
                "categoria_proposta",
                "confianca",
                "conflito",
                "regras",
                "evidencias",
                "observacao",
            ],
        )
        writer.writeheader()
        for row in resultados:
            writer.writerow(
                {
                    "simbolo_id": row["simbolo_id"],
                    "codigo": row["codigo"],
                    "categoria_proposta": row["categoria_proposta"],
                    "confianca": row["confianca"],
                    "conflito": row["conflito"],
                    "regras": ";".join(row["regras"]),
                    "evidencias": ";".join(row["evidencias"]),
                    "observacao": row["observacao"] or "",
                }
            )
    return json_path, csv_path


def main() -> int:
    payload = executar_dry_run()
    json_path, csv_path = salvar_relatorios(payload)
    print(json.dumps({**payload["totais"], "json": str(json_path), "csv": str(csv_path)}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
