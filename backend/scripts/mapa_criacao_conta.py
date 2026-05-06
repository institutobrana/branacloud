"""
Mapa teorico de criacao de conta (analise estatica, sem banco).

Objetivo:
- Ler o codigo de criar_conta_saas() e mapear tabelas que DEVEM/PODEM ser
  populadas por insercoes/seeds/configuracoes iniciais.
- Nao executa SQL nem altera dados.

Uso:
    python backend/scripts/mapa_criacao_conta.py
"""

from __future__ import annotations

import ast
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[3]
BACKEND = ROOT / "saas" / "backend"
MODELS_DIR = BACKEND / "models"
SERVICES_DIR = BACKEND / "services"
TARGET_MODULE = SERVICES_DIR / "signup_service.py"
TARGET_FUNCTION = "criar_conta_saas"

WRITE_METHODS = {"add", "add_all", "merge", "bulk_save_objects", "execute"}
SQL_WRITE_PATTERNS = [
    re.compile(r"\bINSERT\s+INTO\s+([A-Za-z0-9_\.\[\]\"`]+)", re.IGNORECASE),
    re.compile(r"\bUPDATE\s+([A-Za-z0-9_\.\[\]\"`]+)", re.IGNORECASE),
    re.compile(r"\bDELETE\s+FROM\s+([A-Za-z0-9_\.\[\]\"`]+)", re.IGNORECASE),
]


@dataclass
class TableWrite:
    table: str
    operation: str
    origin_module: str
    origin_function: str
    source: str  # direto | funcao_chamada


@dataclass
class AnalysisResult:
    writes: list[TableWrite] = field(default_factory=list)
    calls: list[tuple[str, str, str]] = field(default_factory=list)  # module, func, source


def _read(path: Path) -> str:
    # utf-8-sig remove BOM (U+FEFF) presente em alguns arquivos do projeto.
    return path.read_text(encoding="utf-8-sig", errors="replace")


def _safe_parse(path: Path) -> ast.Module:
    return ast.parse(_read(path), filename=str(path))


def _module_label(path: Path) -> str:
    try:
        return str(path.relative_to(BACKEND)).replace("\\", "/")
    except Exception:
        return str(path)


def _table_from_sql_ident(raw: str) -> str:
    txt = (raw or "").strip()
    txt = txt.replace("[", "").replace("]", "").replace("`", "").replace('"', "")
    if "." in txt:
        txt = txt.split(".")[-1]
    return txt


def _literal_sql_text(node: ast.AST) -> str:
    # text("SQL...")
    if isinstance(node, ast.Call):
        if isinstance(node.func, ast.Name) and node.func.id == "text" and node.args:
            arg0 = node.args[0]
            if isinstance(arg0, ast.Constant) and isinstance(arg0.value, str):
                return arg0.value
        # execute("SQL...")
        if node.args and isinstance(node.args[0], ast.Constant) and isinstance(node.args[0].value, str):
            return node.args[0].value
    if isinstance(node, ast.Constant) and isinstance(node.value, str):
        return node.value
    return ""


def build_model_table_map() -> dict[str, str]:
    out: dict[str, str] = {}
    for py in sorted(MODELS_DIR.glob("*.py")):
        try:
            tree = _safe_parse(py)
        except Exception:
            continue
        for n in tree.body:
            if not isinstance(n, ast.ClassDef):
                continue
            class_name = n.name
            tablename = None
            for b in n.body:
                if isinstance(b, ast.Assign):
                    for t in b.targets:
                        if isinstance(t, ast.Name) and t.id == "__tablename__":
                            if isinstance(b.value, ast.Constant) and isinstance(b.value.value, str):
                                tablename = b.value.value
            if class_name and tablename:
                out[class_name] = tablename
    return out


def build_function_index(path: Path) -> dict[str, ast.FunctionDef]:
    tree = _safe_parse(path)
    out: dict[str, ast.FunctionDef] = {}
    for n in tree.body:
        if isinstance(n, ast.FunctionDef):
            out[n.name] = n
    return out


def build_import_func_map(path: Path) -> dict[str, tuple[Path, str]]:
    """Mapeia simbolos importados de services.* para (arquivo, nome_funcao)."""
    tree = _safe_parse(path)
    out: dict[str, tuple[Path, str]] = {}
    for n in tree.body:
        if not isinstance(n, ast.ImportFrom):
            continue
        mod = str(n.module or "").strip()
        if not mod.startswith("services."):
            continue
        module_name = mod.split(".", 1)[1]
        target_file = SERVICES_DIR / f"{module_name}.py"
        if not target_file.exists():
            continue
        for alias in n.names:
            local_name = alias.asname or alias.name
            out[local_name] = (target_file, alias.name)
    return out


def _resolve_model_name(node: ast.AST, vars_model: dict[str, str]) -> str | None:
    if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
        return node.func.id
    if isinstance(node, ast.Name):
        return vars_model.get(node.id)
    return None


def analyze_function(
    module_path: Path,
    fn_name: str,
    model_table_map: dict[str, str],
    function_index_cache: dict[Path, dict[str, ast.FunctionDef]],
    import_map_cache: dict[Path, dict[str, tuple[Path, str]]],
) -> AnalysisResult:
    if module_path not in function_index_cache:
        function_index_cache[module_path] = build_function_index(module_path)
    if module_path not in import_map_cache:
        import_map_cache[module_path] = build_import_func_map(module_path)

    fn_def = function_index_cache[module_path].get(fn_name)
    if not fn_def:
        return AnalysisResult()

    local_functions = function_index_cache[module_path]
    imported_funcs = import_map_cache[module_path]

    # Historico de atribuicoes por variavel: (lineno, model_name|None).
    # None indica que a variavel foi sobrescrita por algo nao-model.
    var_history: dict[str, list[tuple[int, str | None]]] = {}
    result = AnalysisResult()

    def _history_push(var_name: str, lineno: int, model_name: str | None) -> None:
        var_history.setdefault(var_name, []).append((int(lineno or 0), model_name))

    def _resolve_var_model_before(var_name: str, lineno: int) -> str | None:
        hist = var_history.get(var_name, [])
        if not hist:
            return None
        ref_line = int(lineno or 0)
        best_line = -1
        best_model: str | None = None
        for ln, md in hist:
            if ln <= ref_line and ln >= best_line:
                best_line = ln
                best_model = md
        return best_model

    for node in ast.walk(fn_def):
        if isinstance(node, ast.Assign):
            model_name: str | None = None
            if isinstance(node.value, ast.Call) and isinstance(node.value.func, ast.Name):
                maybe_model = node.value.func.id
                if maybe_model in model_table_map:
                    model_name = maybe_model
            for t in node.targets:
                if isinstance(t, ast.Name):
                    _history_push(t.id, getattr(node, "lineno", 0), model_name)

        if not isinstance(node, ast.Call):
            continue

        # Escritas via db.add/db.execute/etc
        if isinstance(node.func, ast.Attribute) and node.func.attr in WRITE_METHODS:
            method = node.func.attr.upper()
            # add(Model(...)) / add(var_model)
            if node.func.attr in {"add", "merge"} and node.args:
                model_name = None
                arg0 = node.args[0]
                if isinstance(arg0, ast.Name):
                    model_name = _resolve_var_model_before(arg0.id, getattr(node, "lineno", 0))
                else:
                    model_name = _resolve_model_name(arg0, {})
                if model_name and model_name in model_table_map:
                    result.writes.append(
                        TableWrite(
                            table=model_table_map[model_name],
                            operation="INSERT/UPSERT",
                            origin_module=_module_label(module_path),
                            origin_function=fn_name,
                            source="direto",
                        )
                    )
            elif node.func.attr == "add_all" and node.args:
                arg0 = node.args[0]
                if isinstance(arg0, (ast.List, ast.Tuple)):
                    for item in arg0.elts:
                        model_name = _resolve_model_name(item, vars_model)
                        if model_name and model_name in model_table_map:
                            result.writes.append(
                                TableWrite(
                                    table=model_table_map[model_name],
                                    operation="INSERT/UPSERT",
                                    origin_module=_module_label(module_path),
                                    origin_function=fn_name,
                                    source="direto",
                                )
                            )
            elif node.func.attr == "execute":
                sql_txt = ""
                if node.args:
                    sql_txt = _literal_sql_text(node.args[0])
                if sql_txt:
                    for pat in SQL_WRITE_PATTERNS:
                        for m in pat.finditer(sql_txt):
                            raw_table = m.group(1)
                            table = _table_from_sql_ident(raw_table)
                            if table:
                                op = "SQL_WRITE"
                                if sql_txt.strip().upper().startswith("INSERT"):
                                    op = "INSERT"
                                elif sql_txt.strip().upper().startswith("UPDATE"):
                                    op = "UPDATE"
                                elif sql_txt.strip().upper().startswith("DELETE"):
                                    op = "DELETE"
                                result.writes.append(
                                    TableWrite(
                                        table=table,
                                        operation=op,
                                        origin_module=_module_label(module_path),
                                        origin_function=fn_name,
                                        source="direto",
                                    )
                                )

        # Chamadas de funcoes internas/importadas para seguir call graph.
        if isinstance(node.func, ast.Name):
            callee = node.func.id
            if callee in local_functions and callee != fn_name:
                result.calls.append((str(module_path), callee, "funcao_chamada"))
            elif callee in imported_funcs:
                sub_path, sub_name = imported_funcs[callee]
                result.calls.append((str(sub_path), sub_name, "funcao_chamada"))

    return result


def classify_table(table: str, origins: list[TableWrite], all_model_tables: set[str]) -> tuple[str, str]:
    """
    Retorna:
    - classificacao_principal: esperado | opcional | nao_deveria_popular
    - tipo: estrutura | seed | config | admin | misto
    """
    if not origins:
        if table in all_model_tables:
            return "nao_deveria_popular", "nao_populado_na_criacao"
        return "nao_deveria_popular", "desconhecido"

    origem_nomes = {o.origin_function for o in origins}
    origem_mods = {o.origin_module for o in origins}
    tabelas_estrutura = {"clinicas", "usuarios", "prestador_odonto"}
    tabelas_admin = {"usuarios"}
    tabelas_config = {
        "access_profile",
        "etiqueta_padrao",
        "etiqueta_modelo",
        "indice_financeiro",
        "lista_material",
        "procedimento_tabela",
        "convenio_odonto",
        "plano_odonto",
        "doenca_cid",
        "anamnese_questionarios",
        "anamnese_perguntas",
    }

    if table in tabelas_estrutura:
        tipo = "admin" if table in tabelas_admin else "estrutura"
        return "esperado", tipo
    if table in tabelas_config:
        return "esperado", "config"

    # Tabelas vindas de services importados tendem a depender de seeds/arquivos.
    somente_importadas = all(m != "services/signup_service.py" for m in origem_mods)
    if somente_importadas:
        return "opcional", "seed/config"

    # Heuristica por nome da funcao de origem.
    if any("garantir_" in n for n in origem_nomes):
        return "esperado", "seed"

    return "opcional", "misto"


def main() -> None:
    if not TARGET_MODULE.exists():
        raise RuntimeError(f"Arquivo alvo nao encontrado: {TARGET_MODULE}")

    model_table_map = build_model_table_map()
    all_model_tables = set(model_table_map.values())

    function_index_cache: dict[Path, dict[str, ast.FunctionDef]] = {}
    import_map_cache: dict[Path, dict[str, tuple[Path, str]]] = {}

    queue: list[tuple[Path, str, str]] = [(TARGET_MODULE, TARGET_FUNCTION, "direto")]
    visited: set[tuple[Path, str]] = set()
    writes: list[TableWrite] = []
    call_edges: list[tuple[str, str, str, str]] = []  # from_mod:fn, to_mod:fn, source

    while queue:
        mod_path, fn, src = queue.pop(0)
        key = (mod_path, fn)
        if key in visited:
            continue
        visited.add(key)

        result = analyze_function(
            module_path=mod_path,
            fn_name=fn,
            model_table_map=model_table_map,
            function_index_cache=function_index_cache,
            import_map_cache=import_map_cache,
        )

        # Marca origem da escrita conforme entrada no grafo.
        for w in result.writes:
            w.source = src if src else w.source
            writes.append(w)

        for sub_mod_str, sub_fn, sub_src in result.calls:
            sub_mod = Path(sub_mod_str)
            call_edges.append(
                (
                    f"{_module_label(mod_path)}::{fn}",
                    f"{_module_label(sub_mod)}::{sub_fn}",
                    sub_src,
                    src,
                )
            )
            queue.append((sub_mod, sub_fn, "funcao_chamada"))

    # Agregacao por tabela e origem.
    by_table: dict[str, list[TableWrite]] = {}
    for w in writes:
        by_table.setdefault(w.table, []).append(w)

    rows: list[dict[str, Any]] = []
    for table, items in sorted(by_table.items()):
        origins = sorted({f"{w.origin_module}::{w.origin_function}" for w in items})
        ops = sorted({w.operation for w in items})
        cls, tipo = classify_table(table, items, all_model_tables)
        rows.append(
            {
                "tabela": table,
                "origem": " | ".join(origins),
                "tipo": tipo,
                "classificacao": cls,
                "operacoes": ",".join(ops),
            }
        )

    # Tabelas de modelos nao tocadas pelo fluxo.
    touched_tables = set(by_table.keys())
    not_populated = sorted(all_model_tables - touched_tables)

    print("\n===============================")
    print("MAPA TEORICO DE CRIACAO DE CONTA")
    print("===============================")
    print(f"Arquivo alvo: {_module_label(TARGET_MODULE)}")
    print(f"Funcao alvo: {TARGET_FUNCTION}")
    print(f"Funcoes rastreadas: {len(visited)}")
    print(f"Tabelas mapeadas com escrita teorica: {len(rows)}")

    print("\nCADEIA DE CHAMADAS (call graph):")
    if not call_edges:
        print("- (sem chamadas internas mapeadas)")
    else:
        for frm, to, sub_src, parent_src in call_edges:
            print(f"- {frm} -> {to} [{sub_src}]")

    print("\nTabela | Origem | Tipo | Classificacao | Operacoes")
    print("------ | ------ | ---- | ------------- | ---------")
    for r in sorted(rows, key=lambda x: (x["classificacao"], x["tabela"])):
        print(
            f"{r['tabela']} | {r['origem']} | {r['tipo']} | "
            f"{r['classificacao']} | {r['operacoes']}"
        )

    expected = [r for r in rows if r["classificacao"] == "esperado"]
    optional = [r for r in rows if r["classificacao"] == "opcional"]

    print("\n[OK] TABELAS QUE DEVEM TER DADOS (esperado):")
    if expected:
        for r in sorted(expected, key=lambda x: x["tabela"]):
            print(f"- {r['tabela']} ({r['tipo']})")
    else:
        print("- (nenhuma)")

    print("\n[ATENCAO] TABELAS OPCIONAIS:")
    if optional:
        for r in sorted(optional, key=lambda x: x["tabela"]):
            print(f"- {r['tabela']} ({r['tipo']})")
    else:
        print("- (nenhuma)")

    print("\n[NAO POPULAR NO FLUXO] TABELAS QUE NAO DEVERIAM SER POPULADAS (nao tocadas):")
    if not_populated:
        for t in not_populated:
            print(f"- {t}")
    else:
        print("- (nenhuma)")

    print("\nRESUMO FINAL")
    print(f"- esperado: {len(expected)} tabela(s)")
    print(f"- opcional: {len(optional)} tabela(s)")
    print(f"- nao tocadas no fluxo: {len(not_populated)} tabela(s)")


if __name__ == "__main__":
    main()
