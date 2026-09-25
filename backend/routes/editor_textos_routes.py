from pathlib import Path
import json
import hashlib
import copy
import logging
import os
import re
import tempfile
import unicodedata
from datetime import datetime
from html import escape as html_escape, unescape as html_unescape
from html.parser import HTMLParser

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Response, UploadFile
from pydantic import BaseModel, Field
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool

from database import get_db
from models.clinica import Clinica
from models.doenca_cid import DoencaCid
from models.financeiro import ItemAuxiliar
from models.medicamento import Medicamento
from models.modelo_documento import ModeloDocumento
from models.paciente import Paciente
from models.prestador_odonto import PrestadorOdonto
from models.usuario import Usuario
from security.dependencies import get_current_user, require_module_access
from services.digital_signature_service import (
    DigitalSignatureError,
    append_empty_signature_field_to_pdf,
    build_signed_filename,
    sign_pdf_a1_invisible,
)
from services.editor_pdf_service import (
    EditorPdfRenderError,
    generate_editor_pdf_bytes,
    strip_signature_tokens,
)
from services.editor_signature_workflow_service import (
    SignatureWorkflowError,
    prepare_and_invoke_signer,
)
from services.editor_signature_anchor_service import (
    DEFAULT_FIELD_NAME as SIGNATURE_ANCHOR_FIELD_NAME,
    MAX_PDF_BYTES as SIGNATURE_ANCHOR_MAX_PDF_BYTES,
    SignatureAnchorError,
    prepare_signature_anchor,
)
from services.platform_admin_service import registrar_auditoria
from services.receituario_pdf_template_service import (
    ReceituarioPdfTemplateError,
    generate_receituario_acroform_pdf_bytes,
)
from services.model_document_storage import resolve_model_file_info as shared_resolve_model_file_info
from services.editor_catalog_diagnostics import (
    CATALOG_EXTENSIONS,
    MAX_PREVIEW_CHARS,
    MAX_SNIFF_BYTES,
    OFFICE_BINARY_EXTENSIONS,
    SNIFFABLE_CATALOG_EXTENSIONS,
    classify_catalog_bytes,
    registered_catalog_path,
)

logger = logging.getLogger("brana.editor_textos")


router = APIRouter(
    prefix="/editor-textos",
    tags=["editor-textos"],
    dependencies=[Depends(require_module_access("configuracao"))],
)

PROJECT_DIR = Path(__file__).resolve().parents[2]
MODEL_STORAGE_DIR = PROJECT_DIR / "storage" / "modelos"
EDITOR_TEXTOS_DEBUG = str(os.getenv("EDITOR_TEXTOS_DEBUG", "") or "").strip().lower() in {"1", "true", "yes", "on"}
EDITOR_TEXTOS_TMP_DIR = PROJECT_DIR / "backend" / "tmp" / "editor_textos"
TEXT_EXTENSIONS = {".txt", ".rtf", ".mod"}
EDITOR_CATALOG_EXTENSIONS = TEXT_EXTENSIONS | (set(CATALOG_EXTENSIONS) - TEXT_EXTENSIONS)
RTF_RICH_EXTENSIONS = {".rtf", ".mod"}
RUNTIME_RECURSIVE_CANDIDATE_EXTENSIONS = {".mod", ".rtf", ".txt", ".html", ".htm", ".doc", ".docx"}
IMPORTABLE_RUNTIME_EXTENSIONS = {".mod", ".rtf", ".txt", ".html", ".htm"}
TEXT_MODEL_TYPES = {
    "atestados",
    "receitas",
    "recibos",
    "etiquetas",
    "orcamentos",
    "email_agenda",
    "whatsapp_agenda",
    "outros",
}
RTF_DESTINATIONS_TO_IGNORE = {
    "fonttbl",
    "colortbl",
    "datastore",
    "themedata",
    "stylesheet",
    "info",
    "pict",
    "object",
    "fldinst",
    "fldrslt",
    "xmlopen",
    "xmlattrname",
    "xmlattrvalue",
}
PLACEHOLDER_PATTERN = re.compile(r"<<\s*([^>]+?)\s*>>")
ESCAPED_PLACEHOLDER_PATTERN = re.compile(r"&lt;&lt;\s*([^<>]+?)\s*&gt;&gt;", re.IGNORECASE)
MERGE_FIELDS_LEGACY = [
    {"label": "Nome completo", "token": "<<NOME COMPLETO>>"},
    {"label": "Primeiro nome", "token": "<<PRIMEIRO NOME>>"},
    {"label": "Data agenda", "token": "<<AGENDA.DATA>>"},
    {"label": "Hora agenda", "token": "<<AGENDA.HORA>>"},
    {"label": "Cirurgiao", "token": "<<CIRURGIAO.NOME>>"},
    {"label": "Telefone", "token": "<<PACIENTE.TELEFONE>>"},
    {"label": "Celular", "token": "<<PACIENTE.CELULAR>>"},
    {"label": "Email", "token": "<<PACIENTE.EMAIL>>"},
]
MERGE_SNAPSHOT_PATH = PROJECT_DIR / "backend" / "data" / "editor_textos_mesclagem_snapshot.json"
MERGE_LIST_TMP_CANDIDATES = [
    PROJECT_DIR / "storage" / "modelos" / "clinicas" / "1" / "MergeList.tmp",
    PROJECT_DIR / "storage" / "modelos" / "clinicas" / "1" / "Textos" / "MergeList.tmp",
]
MERGE_DEFAULT_CATEGORY = "Atestado"
MERGE_SIGNATURE_FIELD_KEYS = {
    "Cirurgiao.AssinaturaDigital",
    "Cirurgião.AssinaturaDigital",
}
FILENAME_SANITIZE = re.compile(r"[^a-zA-Z0-9._ -]+")
MEDICAMENTOS_AUX_TIPO = "Grupo de medicamento"
TIPOS_USO_AUX_TIPO = "Tipos de uso"
MOTIVOS_ATESTADO_AUX_TIPO = "Motivo de atestado"
MESES_PT_BR = [
    "",
    "janeiro",
    "fevereiro",
    "marco",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
]
DIAS_SEMANA_PT_BR = [
    "segunda-feira",
    "terca-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sabado",
    "domingo",
]
AUDIT_ACAO_PREPARAR_PDF_APP = "editor_textos.preparar_pdf_app"
AUDIT_ACAO_PREPARAR_PDF_APP_FALHA = "editor_textos.preparar_pdf_app_falha"
AUDIT_ORIGEM_PREPARAR_PDF_APP = "editor_textos_preparar_pdf_app"
AUDIT_ACAO_ABRIR_PDF_APP = "editor_textos.abrir_pdf_app"
AUDIT_ACAO_ABRIR_PDF_APP_FALHA = "editor_textos.abrir_pdf_app_falha"
AUDIT_ORIGEM_ABRIR_PDF_APP = "editor_textos_abrir_pdf_app"
AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP = "editor_textos.abrir_pdf_preparado_app"
AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP_FALHA = "editor_textos.abrir_pdf_preparado_app_falha"
AUDIT_ORIGEM_ABRIR_PDF_PREPARADO_APP = "editor_textos_abrir_pdf_preparado_app"
AUDIT_ACAO_PREPARAR_PDF_APP_LEGACY = "editor_textos.preparar_pdf_acrobat"
AUDIT_ACAO_PREPARAR_PDF_APP_FALHA_LEGACY = "editor_textos.preparar_pdf_acrobat_falha"
AUDIT_ORIGEM_PREPARAR_PDF_APP_LEGACY = "editor_textos_preparar_acrobat"
AUDIT_ACAO_ABRIR_PDF_APP_LEGACY = "editor_textos.abrir_no_acrobat"
AUDIT_ACAO_ABRIR_PDF_APP_FALHA_LEGACY = "editor_textos.abrir_no_acrobat_falha"
AUDIT_ORIGEM_ABRIR_PDF_APP_LEGACY = "editor_textos_abrir_acrobat"
AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP_LEGACY = "editor_textos.abrir_pdf_preparado"
AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP_FALHA_LEGACY = "editor_textos.abrir_pdf_preparado_falha"
AUDIT_ORIGEM_ABRIR_PDF_PREPARADO_APP_LEGACY = "editor_textos_abrir_pdf_preparado"


def _pdf_audit_details(
    *,
    document_name: str,
    origem: str,
    paciente_id: int | None = None,
    cirurgiao_id: int | None = None,
    modelo_id: int | None = None,
    arquivo_pdf: str | None = None,
    status: str = "ok",
    detalhe: str | None = None,
    **extra,
) -> dict:
    details = {
        "document_name": str(document_name or "").strip(),
        "origem": str(origem or "editor_textos").strip() or "editor_textos",
        "paciente_id": int(paciente_id) if int(paciente_id or 0) > 0 else None,
        "cirurgiao_id": int(cirurgiao_id) if int(cirurgiao_id or 0) > 0 else None,
        "modelo_id": int(modelo_id) if int(modelo_id or 0) > 0 else None,
        "arquivo_pdf": str(arquivo_pdf or "").strip() or None,
        "status": str(status or "ok").strip() or "ok",
        "detalhe": str(detalhe or "").strip() or None,
    }
    if isinstance(extra, dict):
        for key, value in extra.items():
            key_txt = str(key or "").strip()
            if not key_txt:
                continue
            details[key_txt] = value
    return details


def _registrar_auditoria_editor_pdf(
    db: Session,
    actor: Usuario,
    *,
    acao: str,
    detalhes: dict,
) -> None:
    try:
        registrar_auditoria(
            db,
            actor=actor,
            acao=acao,
            alvo_tipo="editor_textos_pdf",
            alvo_id=detalhes.get("arquivo_pdf") or detalhes.get("document_name") or None,
            detalhes=detalhes,
        )
        db.commit()
    except Exception:
        db.rollback()


def _build_pdf_export_filename(document_name: str | None) -> str:
    base = _sanitize_filename(str(document_name or "").strip() or "documento")
    base = Path(base).stem or "documento"
    return f"{base}.pdf"


def _salvar_pdf_temp_local(pdf_bytes: bytes, document_name: str | None) -> str:
    if not pdf_bytes:
        raise EditorPdfRenderError("PDF vazio para preparar abertura no aplicativo de PDF.")
    EDITOR_TEXTOS_TMP_DIR.mkdir(parents=True, exist_ok=True)
    nome = _build_pdf_export_filename(document_name)
    stem = Path(nome).stem or "documento"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_name = f"{stem}_{timestamp}.pdf"
    temp_path = EDITOR_TEXTOS_TMP_DIR / safe_name
    temp_path.write_bytes(pdf_bytes)
    return str(temp_path)


def _resolver_pdf_temp_local(file_path: str | None) -> Path:
    raw = str(file_path or "").strip()
    if not raw:
        raise EditorPdfRenderError("Caminho do PDF nao informado.")
    candidate = Path(raw).resolve()
    base_dir = EDITOR_TEXTOS_TMP_DIR.resolve()
    try:
        candidate.relative_to(base_dir)
    except Exception as exc:
        raise EditorPdfRenderError("Caminho do PDF temporario invalido.") from exc
    if candidate.suffix.lower() != ".pdf":
        raise EditorPdfRenderError("Arquivo informado nao e um PDF.")
    if not candidate.exists() or not candidate.is_file():
        raise EditorPdfRenderError("Arquivo PDF temporario nao foi encontrado.")
    return candidate


def _abrir_pdf_path_no_app_local(file_path: str | None) -> str:
    if os.name != "nt":
        raise EditorPdfRenderError("Abertura direta de PDF disponivel apenas no Windows local.")
    temp_path = _resolver_pdf_temp_local(file_path)
    try:
        os.startfile(str(temp_path))
    except Exception as exc:
        raise EditorPdfRenderError("Nao foi possivel abrir o PDF no aplicativo padrao deste computador.") from exc
    return str(temp_path)


def _abrir_pdf_no_app_local(pdf_bytes: bytes, document_name: str | None) -> str:
    temp_path = _salvar_pdf_temp_local(pdf_bytes, document_name)
    return _abrir_pdf_path_no_app_local(temp_path)


def _generate_editor_pdf_document(
    *,
    conteudo: str,
    conteudo_formato: str,
    pagina_config: dict | None,
    page_snapshot_data_url: str | None,
    page_snapshot_html: str | None,
    document_name: str,
    strip_signature_placeholders: bool = False,
) -> tuple[bytes, str]:
    conteudo_render = str(conteudo or "")
    if strip_signature_placeholders:
        conteudo_render, _ = strip_signature_tokens(conteudo_render)
    pdf_bytes = generate_editor_pdf_bytes(
        conteudo=conteudo_render,
        conteudo_formato=str(conteudo_formato or "text"),
        pagina_config=pagina_config,
        titulo=str(document_name or "Documento"),
        page_snapshot_data_url=str(page_snapshot_data_url or "").strip() or None,
        page_snapshot_html=str(page_snapshot_html or "").strip() or None,
    )
    filename = _build_pdf_export_filename(document_name)
    return pdf_bytes, filename


def _paciente_endereco_linhas(values: dict[str, str]) -> tuple[str, str]:
    endereco = str(values.get(_norm_merge_key("Paciente.EnderecoRes")) or "").strip()
    cidade = str(values.get(_norm_merge_key("Paciente.CidadeRes")) or "").strip()
    estado = str(values.get(_norm_merge_key("Paciente.EstadoRes")) or "").strip()
    linha2 = " / ".join([part for part in [cidade, estado] if str(part or "").strip()])
    return endereco, linha2


def _clinica_rodape_linhas(values: dict[str, str]) -> tuple[str, str]:
    endereco = str(values.get(_norm_merge_key("Clinica.Endereco")) or "").strip()
    bairro = str(values.get(_norm_merge_key("Clinica.Bairro")) or "").strip()
    cep = str(values.get(_norm_merge_key("Clinica.CEP")) or "").strip()
    cidade = str(values.get(_norm_merge_key("Clinica.Cidade")) or "").strip()
    estado = str(values.get(_norm_merge_key("Clinica.Estado")) or "").strip()
    telefones = str(values.get(_norm_merge_key("Clinica.Telefones")) or "").strip()
    linha1_parts = [part for part in [endereco, bairro] if str(part or "").strip()]
    if cep:
        linha1_parts.append(f"CEP {cep}")
    linha1 = " - ".join(linha1_parts)
    linha2 = " / ".join([part for part in [cidade, estado, telefones] if str(part or "").strip()])
    return linha1, linha2


class ModeloTextoSalvarPayload(BaseModel):
    nome: str = Field(default="", max_length=180)
    conteudo: str = Field(default="")
    conteudo_formato: str | None = Field(default="text", max_length=20)
    tipo_modelo: str | None = Field(default=None, max_length=40)
    extensao: str | None = Field(default=None, max_length=20)
    pagina_config: dict | None = None


class ModeloTextoSaveAsPayload(ModeloTextoSalvarPayload):
    replace_model_id: int | None = Field(default=None, gt=0)


class ModeloTextoRenomearPayload(BaseModel):
    nome: str = Field(default="", max_length=180)


class RtfImportPayload(BaseModel):
    content: str = Field(min_length=8, max_length=2_000_000)


class MesclarTextoPayload(BaseModel):
    conteudo: str = Field(default="")
    conteudo_formato: str | None = Field(default="text", max_length=20)
    paciente_id: int | None = None
    cirurgiao_id: int | None = None
    extras: dict[str, str] | None = None
    preservar_nao_resolvido: bool = True


class ExportarPdfPayload(BaseModel):
    conteudo: str = Field(default="")
    conteudo_formato: str | None = Field(default="text", max_length=20)
    pagina_config: dict | None = None
    page_snapshot_data_url: str | None = None
    page_snapshot_html: str | None = None
    document_name: str | None = Field(default="", max_length=180)
    origem: str | None = Field(default="editor_textos", max_length=60)
    paciente_id: int | None = None
    cirurgiao_id: int | None = None
    modelo_id: int | None = None
    strip_signature_tokens: bool = False
    add_signature_field: bool = False
    signature_field_name: str | None = Field(default="Assinatura", max_length=120)
    signature_box_hint: dict | None = None


class ExportarReceitaTemplatePayload(BaseModel):
    corpo_receita: str = Field(default="")
    paciente_id: int
    cirurgiao_id: int | None = None
    modelo_id: int | None = None
    document_name: str | None = Field(default="", max_length=180)
    origem: str | None = Field(default="editor_textos_receita_template", max_length=80)


class RegistrarAssinaturaLocalPayload(BaseModel):
    origem: str | None = Field(default="editor_textos_assinatura_local", max_length=80)
    status: str | None = Field(default="solicitado", max_length=30)
    document_name: str | None = Field(default="", max_length=180)
    arquivo_pdf: str | None = Field(default="", max_length=220)
    paciente_id: int | None = None
    cirurgiao_id: int | None = None
    modelo_id: int | None = None
    thumbprint: str | None = Field(default="", max_length=120)
    detalhe: str | None = Field(default="", max_length=500)


class AbrirPdfAppResponse(BaseModel):
    ok: bool = True
    opened: bool = True
    file_path: str


class AbrirPdfAppPathPayload(BaseModel):
    file_path: str = Field(..., max_length=500)


def _merge_sort_key(value: str) -> str:
    txt = str(value or "")
    txt = unicodedata.normalize("NFD", txt)
    txt = "".join(ch for ch in txt if unicodedata.category(ch) != "Mn")
    return txt.casefold()


def _norm_key(value: str) -> str:
    txt = str(value or "")
    txt = unicodedata.normalize("NFD", txt)
    txt = "".join(ch for ch in txt if unicodedata.category(ch) != "Mn")
    return txt.casefold().strip()


def _repair_mojibake(value: str) -> str:
    txt = str(value or "")
    for _ in range(2):
        if "Ã" in txt or "Â" in txt or "â" in txt:
            try:
                fixed = txt.encode("latin-1", errors="ignore").decode("utf-8", errors="ignore")
            except Exception:
                break
            if fixed and fixed != txt:
                txt = fixed
                continue
        break
    return txt


def _norm_merge_key(value: str) -> str:
    txt = _repair_mojibake(value)
    txt = unicodedata.normalize("NFD", txt)
    txt = "".join(ch for ch in txt if unicodedata.category(ch) != "Mn")
    txt = txt.casefold().strip()
    txt = re.sub(r"\s+", "", txt)
    txt = txt.replace("_", "").replace("-", "").replace("/", "")
    txt = re.sub(r"[^a-z0-9.]", "", txt)
    return txt


def _set_merge_value(store: dict[str, str], keys: list[str], value: str | int | float | None) -> None:
    val = str(value or "")
    for key in keys:
        norm = _norm_merge_key(key)
        if norm:
            store[norm] = val


def _split_nome(value: str) -> tuple[str, str]:
    nome = str(value or "").strip()
    if not nome:
        return "", ""
    parts = [p for p in nome.split() if p]
    if len(parts) <= 1:
        return nome, ""
    return parts[0], " ".join(parts[1:])


def _parse_date_like(value: str | None) -> datetime | None:
    raw = str(value or "").strip()
    if not raw:
        return None
    for fmt in ("%d/%m/%Y", "%d/%m/%y", "%Y-%m-%d", "%Y/%m/%d"):
        try:
            return datetime.strptime(raw, fmt)
        except Exception:
            continue
    m = re.match(r"^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$", raw)
    if not m:
        return None
    try:
        return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
    except Exception:
        return None


def _calc_idade(value: str | None) -> str:
    dt = _parse_date_like(value)
    if not dt:
        return ""
    hoje = datetime.now()
    idade = hoje.year - dt.year - ((hoje.month, hoje.day) < (dt.month, dt.day))
    return str(max(0, int(idade)))


def _build_merge_values(
    db: Session,
    current_user: Usuario,
    paciente_id: int | None,
    cirurgiao_id: int | None,
    extras: dict[str, str] | None = None,
) -> dict[str, str]:
    values: dict[str, str] = {}
    now = datetime.now()
    data_hoje = now.strftime("%d/%m/%Y")
    mes_nome = MESES_PT_BR[now.month] if now.month < len(MESES_PT_BR) else ""
    dia_semana = DIAS_SEMANA_PT_BR[now.weekday()] if 0 <= now.weekday() < len(DIAS_SEMANA_PT_BR) else ""

    _set_merge_value(values, ["Data.DataHoje"], data_hoje)
    _set_merge_value(values, ["Data.DiaHoje"], now.strftime("%d"))
    _set_merge_value(values, ["Data.DiaSemana"], dia_semana)
    _set_merge_value(values, ["Data.MesHoje", "Data.MêsHoje"], now.strftime("%m"))
    _set_merge_value(values, ["Data.MesExt", "Data.MêsExt", "Data.MesExtenso", "Data.MêsExtenso"], mes_nome)
    _set_merge_value(values, ["Data.AnoHoje"], now.strftime("%Y"))

    clinica = (
        db.query(Clinica)
        .filter(Clinica.id == int(current_user.clinica_id))
        .first()
    )
    prefs = _load_user_preferences(current_user)
    clinica_opts = _load_clinica_system_options(clinica)
    clinica_dados = clinica_opts.get("clinica") if isinstance(clinica_opts.get("clinica"), dict) else {}
    dados = prefs.get("dados") if isinstance(prefs.get("dados"), dict) else {}
    if not isinstance(dados, dict):
        dados = {}
    dados_usuario = prefs.get("dados_usuario") if isinstance(prefs.get("dados_usuario"), dict) else {}
    if not isinstance(dados_usuario, dict):
        dados_usuario = {}
    _set_merge_value(values, ["Clinica.Nome"], getattr(clinica, "nome", "") or clinica_dados.get("nome") or dados_usuario.get("nome") or dados.get("nome"))
    _set_merge_value(values, ["Clinica.Endereco"], clinica_dados.get("endereco") or dados_usuario.get("endereco") or dados.get("endereco"))
    _set_merge_value(values, ["Clinica.Bairro"], clinica_dados.get("bairro") or dados_usuario.get("bairro") or dados.get("bairro"))
    _set_merge_value(values, ["Clinica.Cidade"], clinica_dados.get("cidade") or dados_usuario.get("cidade") or dados.get("cidade"))
    _set_merge_value(values, ["Clinica.CEP"], clinica_dados.get("cep") or dados_usuario.get("cep") or dados.get("cep"))
    _set_merge_value(values, ["Clinica.Estado"], clinica_dados.get("uf") or dados_usuario.get("uf") or dados.get("uf"))
    _set_merge_value(values, ["Clinica.Cabecalho"], "")
    _set_merge_value(values, ["Clinica.CGC"], getattr(clinica, "cnpj", ""))
    _set_merge_value(values, ["Clinica.IE"], "")
    _set_merge_value(values, ["Clinica.Telefones"], clinica_dados.get("telefones") or dados_usuario.get("telefones") or dados.get("telefones"))
    cir_id = int(cirurgiao_id or 0) or int(getattr(current_user, "prestador_id", 0) or 0)
    cir = None
    if cir_id > 0:
        cir = (
            db.query(PrestadorOdonto)
            .filter(
                PrestadorOdonto.id == cir_id,
                PrestadorOdonto.clinica_id == int(current_user.clinica_id),
            )
            .first()
        )
    cir_nome = str((getattr(cir, "nome", "") or getattr(cir, "apelido", "") or current_user.nome or "")).strip()
    _set_merge_value(values, ["Cirurgiao.Nome", "Cirurgião.Nome"], cir_nome)
    _set_merge_value(values, ["Cirurgiao.CPF", "Cirurgião.CPF"], getattr(cir, "cpf", "") or dados.get("cpf"))
    _set_merge_value(values, ["Cirurgiao.CRO", "Cirurgião.CRO"], getattr(cir, "cro", "") or dados.get("cro"))
    _set_merge_value(values, list(MERGE_SIGNATURE_FIELD_KEYS), "")

    pac_id = int(paciente_id or 0)
    pac = None
    if pac_id > 0:
        pac = (
            db.query(Paciente)
            .filter(
                Paciente.id == pac_id,
                Paciente.clinica_id == int(current_user.clinica_id),
            )
            .first()
        )
    if pac:
        nome_paciente = str(pac.nome or "").strip()
        sobrenome_paciente = str(pac.sobrenome or "").strip()
        nome_completo = str(pac.nome_completo or "").strip() or " ".join(
            p for p in [nome_paciente, sobrenome_paciente] if p
        ).strip()
        primeiro_nome, _ = _split_nome(nome_completo)
        _set_merge_value(values, ["Paciente.Numero", "Paciente.Número"], pac.codigo)
        _set_merge_value(values, ["Paciente.Nome"], nome_paciente or primeiro_nome)
        _set_merge_value(values, ["Paciente.Sobrenome"], sobrenome_paciente)
        _set_merge_value(values, ["Paciente.NomeCompleto"], nome_completo)
        _set_merge_value(values, ["Paciente.Apelido"], pac.apelido)
        _set_merge_value(values, ["Paciente.EnderecoCom", "Paciente.EndereçoCom"], pac.endereco)
        _set_merge_value(values, ["Paciente.EnderecoRes", "Paciente.EndereçoRes"], pac.endereco)
        _set_merge_value(values, ["Paciente.ComplementoCom"], pac.complemento)
        _set_merge_value(values, ["Paciente.ComplementoRes"], pac.complemento)
        _set_merge_value(values, ["Paciente.EstadoCom"], pac.uf)
        _set_merge_value(values, ["Paciente.EstadoRes"], pac.uf)
        _set_merge_value(values, ["Paciente.BairroCom"], pac.bairro)
        _set_merge_value(values, ["Paciente.BairroRes"], pac.bairro)
        _set_merge_value(values, ["Paciente.CEPCom"], pac.cep)
        _set_merge_value(values, ["Paciente.CEPRes"], pac.cep)
        _set_merge_value(values, ["Paciente.CidadeCom"], pac.cidade)
        _set_merge_value(values, ["Paciente.CidadeRes"], pac.cidade)
        _set_merge_value(values, ["Paciente.EMail"], pac.email)
        nasc = _parse_date_like(pac.data_nascimento)
        _set_merge_value(values, ["Paciente.DiaAniversario", "Paciente.DiaAniversário"], nasc.strftime("%d") if nasc else "")
        _set_merge_value(values, ["Paciente.MesAniversario", "Paciente.MêsAniversário"], nasc.strftime("%m") if nasc else "")
        _set_merge_value(values, ["Paciente.MesAniversarioExt", "Paciente.MêsAniversárioExt"], (MESES_PT_BR[nasc.month] if nasc else ""))
        _set_merge_value(values, ["Paciente.Responsavel", "Paciente.Responsável"], "")
        _set_merge_value(values, ["Paciente.DataCadastro"], pac.data_cadastro)
        _set_merge_value(values, ["Paciente.IndicadoPor"], pac.indicado_por)
        _set_merge_value(values, ["Paciente.CPF"], pac.cpf)
        _set_merge_value(values, ["Paciente.RG"], pac.rg)
        _set_merge_value(values, ["Paciente.Idade"], _calc_idade(pac.data_nascimento))
        data_nasc_fmt = nasc.strftime("%d/%m/%Y") if nasc else str(pac.data_nascimento or "")
        _set_merge_value(values, ["Paciente.DataNasc"], data_nasc_fmt)
        _set_merge_value(values, ["Paciente.TelRes"], pac.fone1)
        _set_merge_value(values, ["Paciente.TelCom"], pac.fone2)
        _set_merge_value(values, ["Paciente.TelFax"], pac.fone3)
        _set_merge_value(values, ["Paciente.TelCel"], pac.fone4)
        _set_merge_value(values, ["Paciente.TelRec"], "")
        _set_merge_value(values, ["Etiqueta.Bairro"], pac.bairro)
        _set_merge_value(values, ["Etiqueta.CEP"], pac.cep)
        _set_merge_value(values, ["Etiqueta.Cidade"], pac.cidade)
        _set_merge_value(values, ["Etiqueta.Endereco", "Etiqueta.Endereço"], pac.endereco)
        _set_merge_value(values, ["Etiqueta.Estado"], pac.uf)
        _set_merge_value(values, ["Etiqueta.Nome"], nome_completo or nome_paciente)
        _set_merge_value(values, ["Etiqueta.Numero", "Etiqueta.Número"], pac.codigo)
        _set_merge_value(values, ["Etiqueta.Pais", "Etiqueta.País"], "Brasil")
        _set_merge_value(values, ["Etiqueta.Telefone"], pac.fone1 or pac.fone2)
        _set_merge_value(values, ["Contato.Nome"], nome_completo or nome_paciente)
        _set_merge_value(values, ["Contato.EMail"], pac.email)
        _set_merge_value(values, ["Recibo.NomePaciente"], nome_completo or nome_paciente)
        _set_merge_value(values, ["Recibo.CPFPaciente"], pac.cpf)

    _set_merge_value(values, ["Recibo.NomeCirurgiao", "Recibo.NomeCirurgião"], cir_nome)
    _set_merge_value(values, ["Recibo.CPFCirurgiao", "Recibo.CPFCirurgião"], getattr(cir, "cpf", "") or dados.get("cpf"))

    if isinstance(extras, dict):
        for raw_key, raw_value in extras.items():
            key = str(raw_key or "").strip()
            if not key:
                continue
            _set_merge_value(values, [key], raw_value)
            if key.startswith("<<") and key.endswith(">>"):
                _set_merge_value(values, [key[2:-2]], raw_value)
    return values


def _render_merge_text(conteudo: str, values: dict[str, str], preservar_nao_resolvido: bool = True) -> tuple[str, int, int]:
    total = 0
    substituidos = 0
    signature_keys = {_norm_merge_key(item) for item in MERGE_SIGNATURE_FIELD_KEYS}

    def _replace(match: re.Match) -> str:
        nonlocal total, substituidos
        total += 1
        token_raw = str(match.group(1) or "").strip()
        token_norm = _norm_merge_key(token_raw)
        val = str(values.get(token_norm, "") or "")
        if val:
            substituidos += 1
            return val
        if token_norm in signature_keys:
            substituidos += 1
            return ""
        return match.group(0) if preservar_nao_resolvido else ""

    out = PLACEHOLDER_PATTERN.sub(_replace, str(conteudo or ""))
    return out, total, substituidos


def _render_merge_html(conteudo_html: str, values: dict[str, str], preservar_nao_resolvido: bool = True) -> tuple[str, int, int]:
    total = 0
    substituidos = 0

    def _replace_escaped(match: re.Match) -> str:
        nonlocal total, substituidos
        total += 1
        token_raw = str(match.group(1) or "").strip()
        token_norm = _norm_merge_key(token_raw)
        val = str(values.get(token_norm, "") or "")
        if val:
            substituidos += 1
            return html_escape(val).replace("\n", "<br>")
        return match.group(0) if preservar_nao_resolvido else ""

    out = ESCAPED_PLACEHOLDER_PATTERN.sub(_replace_escaped, str(conteudo_html or ""))
    # fallback: caso exista token bruto em HTML.
    out2, total_raw, sub_raw = _render_merge_text(out, values, preservar_nao_resolvido=preservar_nao_resolvido)
    return out2, total + total_raw, substituidos + sub_raw


def _aux_tipo_match(value: str, target: str) -> bool:
    current = _norm_key(value)
    expected = _norm_key(target)
    if not current or not expected:
        return False
    if current == expected:
        return True
    if expected == _norm_key(TIPOS_USO_AUX_TIPO):
        return ("tipo" in current and "uso" in current)
    if expected == _norm_key(MEDICAMENTOS_AUX_TIPO):
        return ("grupo" in current and "medic" in current)
    return False


def _load_user_preferences(usuario: Usuario) -> dict:
    raw = str(usuario.preferencias_usuario_json or "").strip()
    if not raw:
        return {}
    try:
        data = json.loads(raw)
    except Exception:
        return {}
    return data if isinstance(data, dict) else {}


def _load_clinica_system_options(clinica: Clinica | None) -> dict:
    if not clinica:
        return {}
    raw = str(getattr(clinica, "opcoes_sistema_json", "") or "").strip()
    if not raw:
        return {}
    try:
        data = json.loads(raw)
    except Exception:
        return {}
    return data if isinstance(data, dict) else {}


def _resolve_modelo_receita_preferido(usuario: Usuario) -> int | None:
    return _resolve_modelo_texto_preferido(usuario, "modelo_impresso_receitas_id")


def _resolve_modelo_atestado_preferido(usuario: Usuario) -> int | None:
    return _resolve_modelo_texto_preferido(usuario, "modelo_impresso_atestados_id")


def _resolve_modelo_texto_preferido(usuario: Usuario, field_name: str) -> int | None:
    prefs = _load_user_preferences(usuario)
    modelos = prefs.get("modelos") if isinstance(prefs.get("modelos"), dict) else {}
    if not isinstance(modelos, dict):
        return None
    raw = modelos.get(field_name)
    try:
        value = int(raw) if raw not in (None, "", 0, "0") else None
    except Exception:
        value = None
    return value if value and value > 0 else None


def _listar_modelos_por_tipo_contexto(db: Session, current_user: Usuario, tipo_modelo: str) -> list[dict]:
    rows = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.ativo.is_(True),
            ModeloDocumento.tipo_modelo == str(tipo_modelo or "").strip(),
            or_(
                ModeloDocumento.clinica_id == int(current_user.clinica_id),
                ModeloDocumento.clinica_id.is_(None),
            ),
        )
        .order_by(
            ModeloDocumento.clinica_id.is_(None).asc(),
            func.lower(ModeloDocumento.nome_exibicao).asc(),
            ModeloDocumento.id.asc(),
        )
        .all()
    )
    itens: list[dict] = []
    for row in rows:
        nome = str(row.nome_exibicao or "").strip() or str(row.nome_arquivo or "").strip()
        if not nome:
            continue
        origem = "clinica" if int(row.clinica_id or 0) == int(current_user.clinica_id) else "base"
        itens.append(
            {
                "id": int(row.id),
                "nome": nome,
                "origem": origem,
                "nome_arquivo": str(row.nome_arquivo or "").strip(),
            }
        )
    return itens


def _listar_modelos_receituario_contexto(db: Session, current_user: Usuario) -> list[dict]:
    return _listar_modelos_por_tipo_contexto(db, current_user, "receitas")


def _listar_modelos_atestado_contexto(db: Session, current_user: Usuario) -> list[dict]:
    return _listar_modelos_por_tipo_contexto(db, current_user, "atestados")


def _listar_cirurgioes_contexto(db: Session, current_user: Usuario) -> list[dict]:
    rows = (
        db.query(PrestadorOdonto)
        .filter(
            PrestadorOdonto.clinica_id == int(current_user.clinica_id),
            or_(
                PrestadorOdonto.inativo.is_(False),
                PrestadorOdonto.inativo.is_(None),
            ),
        )
        .order_by(func.lower(PrestadorOdonto.nome).asc(), PrestadorOdonto.id.asc())
        .all()
    )
    itens: list[dict] = []
    for row in rows:
        nome = str((row.apelido or row.nome or "")).strip()
        if not nome:
            continue
        itens.append(
            {
                "id": int(row.id),
                "nome": nome,
                "nome_completo": str(row.nome or "").strip(),
                "apelido": str(row.apelido or "").strip(),
            }
        )
    return itens


def _listar_tipos_uso_contexto(db: Session, current_user: Usuario) -> list[dict]:
    rows = (
        db.query(ItemAuxiliar)
        .filter(
            ItemAuxiliar.clinica_id == int(current_user.clinica_id),
            or_(
                ItemAuxiliar.inativo.is_(False),
                ItemAuxiliar.inativo.is_(None),
            ),
        )
        .order_by(
            func.coalesce(ItemAuxiliar.ordem, 999999).asc(),
            func.lower(ItemAuxiliar.descricao).asc(),
            ItemAuxiliar.id.asc(),
        )
        .all()
    )
    itens: list[dict] = []
    for row in rows:
        if not _aux_tipo_match(str(row.tipo or ""), TIPOS_USO_AUX_TIPO):
            continue
        descricao = str(row.descricao or "").strip()
        if not descricao:
            continue
        itens.append(
            {
                "id": int(row.id),
                "codigo": str(row.codigo or "").strip(),
                "descricao": descricao,
            }
        )
    return itens


def _listar_motivos_atestado_contexto(db: Session, current_user: Usuario) -> list[dict]:
    rows = (
        db.query(ItemAuxiliar)
        .filter(
            ItemAuxiliar.clinica_id == int(current_user.clinica_id),
            or_(
                ItemAuxiliar.inativo.is_(False),
                ItemAuxiliar.inativo.is_(None),
            ),
        )
        .order_by(
            func.coalesce(ItemAuxiliar.ordem, 999999).asc(),
            func.lower(ItemAuxiliar.descricao).asc(),
            ItemAuxiliar.id.asc(),
        )
        .all()
    )
    itens: list[dict] = []
    for row in rows:
        if not _aux_tipo_match(str(row.tipo or ""), MOTIVOS_ATESTADO_AUX_TIPO):
            continue
        descricao = str(row.descricao or "").strip()
        if not descricao:
            continue
        itens.append(
            {
                "id": int(row.id),
                "codigo": str(row.codigo or "").strip(),
                "descricao": descricao,
            }
        )
    return itens


def _serialize_cid_contexto(item: DoencaCid) -> dict:
    return {
        "id": int(item.id),
        "legacy_registro": int(item.legacy_registro or 0),
        "codigo": str(item.codigo or "").strip(),
        "descricao": str(item.descricao or "").strip(),
        "observacoes": str(item.observacoes or "").strip(),
        "preferido": bool(item.preferido),
    }


def _listar_cid_atestado_contexto(
    db: Session,
    current_user: Usuario,
    *,
    q: str = "",
    letra: str = "",
    apenas_preferidos: bool = False,
    limit: int = 250,
) -> list[dict]:
    clinic_id = int(current_user.clinica_id)
    termo = str(q or "").replace("\x00", "").strip()
    inicial = str(letra or "").replace("\x00", "").strip().upper()
    max_items = max(1, min(int(limit or 250), 1000))

    query = db.query(DoencaCid).filter(DoencaCid.clinica_id == clinic_id)
    if apenas_preferidos:
        query = query.filter(DoencaCid.preferido.is_(True))
    if termo:
        like = f"%{termo}%"
        query = query.filter(
            or_(
                DoencaCid.codigo.ilike(like),
                DoencaCid.descricao.ilike(like),
            )
        )
    if inicial and inicial != "*":
        like_letra = f"{inicial}%"
        query = query.filter(
            or_(
                DoencaCid.codigo.ilike(like_letra),
                DoencaCid.descricao.ilike(like_letra),
            )
        )
    rows = (
        query.order_by(DoencaCid.codigo.asc(), DoencaCid.id.asc())
        .limit(max_items)
        .all()
    )
    return [_serialize_cid_contexto(item) for item in rows]


def _listar_medicamentos_contexto(
    db: Session,
    current_user: Usuario,
    q: str = "",
    limit: int = 250,
) -> tuple[list[dict], str]:
    termo = str(q or "").strip().casefold()
    clinic_id = int(current_user.clinica_id)
    max_items = max(1, int(limit or 250))

    has_medicamento_rows = (
        db.query(Medicamento.id)
        .filter(Medicamento.clinica_id == clinic_id)
        .first()
        is not None
    )

    if has_medicamento_rows:
        query = (
            db.query(Medicamento)
            .filter(
                Medicamento.clinica_id == clinic_id,
                or_(
                    Medicamento.inativo.is_(False),
                    Medicamento.inativo.is_(None),
                ),
            )
        )
        if termo:
            like = f"%{termo}%"
            query = query.filter(
                or_(
                    func.lower(func.coalesce(Medicamento.nome, "")).like(like),
                    func.lower(func.coalesce(Medicamento.grupo, "")).like(like),
                    func.lower(func.coalesce(Medicamento.descricao_substancia, "")).like(like),
                    func.lower(func.coalesce(Medicamento.apresentacao, "")).like(like),
                    func.lower(func.coalesce(Medicamento.laboratorio, "")).like(like),
                )
            )
        rows_medicamento = (
            query.order_by(
                func.lower(func.coalesce(Medicamento.nome, "")).asc(),
                Medicamento.id.asc(),
            )
            .limit(max_items)
            .all()
        )
        itens_medicamento: list[dict] = []
        for row in rows_medicamento:
            nome = str(row.nome or "").strip()
            if not nome:
                continue
            itens_medicamento.append(
                {
                    "id": int(row.id),
                    "codigo": "",
                    "nome": nome,
                    "grupo": str(row.grupo or "").strip(),
                    "apresentacao": str(row.apresentacao or "").strip(),
                    "prescricao_adulto": str(row.posologia_adulto or ""),
                    "prescricao_crianca": str(row.posologia_crianca or ""),
                    "quantidade_adulto": str(row.quantidade_padrao_adulto or "").strip(),
                    "quantidade_crianca": str(row.quantidade_padrao_crianca or "").strip(),
                    "uso_padrao": str(row.uso or "").strip(),
                    "observacoes": str(row.observacoes or ""),
                    "fonte": "medicamento",
                }
            )
        return itens_medicamento, "medicamento"

    rows_aux = (
        db.query(ItemAuxiliar)
        .filter(
            ItemAuxiliar.clinica_id == clinic_id,
            or_(
                ItemAuxiliar.inativo.is_(False),
                ItemAuxiliar.inativo.is_(None),
            ),
        )
        .order_by(func.lower(ItemAuxiliar.descricao).asc(), ItemAuxiliar.id.asc())
        .all()
    )
    itens: list[dict] = []
    for row in rows_aux:
        if not _aux_tipo_match(str(row.tipo or ""), MEDICAMENTOS_AUX_TIPO):
            continue
        codigo = str(row.codigo or "").strip()
        nome = str(row.descricao or "").strip()
        if not nome:
            continue
        if termo and termo not in codigo.casefold() and termo not in nome.casefold():
            continue
        itens.append(
            {
                "id": int(row.id),
                "codigo": codigo,
                "nome": nome,
                "grupo": nome,
                "apresentacao": "",
                "prescricao_adulto": "",
                "prescricao_crianca": "",
                "quantidade_adulto": "",
                "quantidade_crianca": "",
                "uso_padrao": "",
                "observacoes": "",
                "fonte": "item_auxiliar_grupo_medicamento",
            }
        )
        if len(itens) >= max_items:
            break
    return itens, "item_auxiliar_grupo_medicamento"


def _carregar_paciente_contexto(db: Session, current_user: Usuario, paciente_id: int | None) -> dict | None:
    pid = int(paciente_id or 0)
    if pid <= 0:
        return None
    paciente = (
        db.query(Paciente)
        .filter(
            Paciente.id == pid,
            Paciente.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not paciente:
        return None
    return {
        "id": int(paciente.id),
        "codigo": int(paciente.codigo or 0) if paciente.codigo is not None else None,
        "nome": str(paciente.nome or "").strip(),
        "email": str(paciente.email or "").strip(),
        "fone1": str(paciente.fone1 or "").strip(),
        "fone2": str(paciente.fone2 or "").strip(),
    }


def _merge_fields_debug_payload_source(source: str, total: int, total_groups: int) -> None:
    if not EDITOR_TEXTOS_DEBUG:
        return
    logger.info(
        "MERGE FIELDS PAYLOAD SOURCE",
        extra={
            "source": source,
            "total_campos": int(total or 0),
            "total_grupos": int(total_groups or 0),
        },
    )


def _merge_fields_from_snapshot() -> tuple[list[dict], list[str]]:
    if not MERGE_SNAPSHOT_PATH.exists():
        return [], []
    raw = json.loads(MERGE_SNAPSHOT_PATH.read_text(encoding="utf-8-sig"))
    category_order = [
        str(cat).strip()
        for cat in (raw.get("categorias_ordem_arquivo") or [])
        if str(cat).strip()
    ]
    entries: list[dict] = []
    for item in (raw.get("campos") or []):
        categoria = str(item.get("categoria") or "").strip()
        campo = str(item.get("campo") or "").strip()
        descricao = str(item.get("descricao") or "").strip()
        token = str(item.get("token") or "").strip()
        if not categoria or not campo:
            continue
        if not token:
            token = f"<<{categoria}.{campo}>>"
        entries.append(
            {
                "categoria": categoria,
                "campo": campo,
                "descricao": descricao or campo,
                "token": token,
            }
        )
    return entries, category_order


def _read_merge_list_tmp_text(path: Path) -> str:
    for encoding in ("utf-8-sig", "cp1252", "latin-1"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    return path.read_text(encoding="utf-8", errors="replace")


def _merge_fields_from_merge_list_tmp() -> tuple[list[dict], list[str]]:
    for path in MERGE_LIST_TMP_CANDIDATES:
        if not path.exists():
            continue
        text = _read_merge_list_tmp_text(path)
        first_line = ""
        for line in text.splitlines():
            if line.strip():
                first_line = line
                break
        if not first_line:
            continue
        entries: list[dict] = []
        category_order: list[str] = []
        for raw_name in first_line.split("\t"):
            name = str(raw_name or "").strip()
            if not name:
                continue
            categoria = "Geral"
            campo = name
            if "." in name:
                categoria, campo = (name.split(".", 1) + [""])[:2]
                categoria = str(categoria).strip() or "Geral"
                campo = str(campo).strip() or name
            if categoria not in category_order:
                category_order.append(categoria)
            entries.append(
                {
                    "categoria": categoria,
                    "campo": campo,
                    "descricao": campo,
                    "token": f"<<{name}>>",
                }
            )
        if entries:
            return entries, category_order
    return [], []


def _merge_fields_from_legacy() -> tuple[list[dict], list[str]]:
    entries: list[dict] = []
    category_order: list[str] = []
    for item in MERGE_FIELDS_LEGACY:
        token = str(item.get("token") or "").strip()
        label = str(item.get("label") or token).strip()
        categoria = "Geral"
        campo = label
        if token.startswith("<<") and token.endswith(">>") and "." in token:
            miolo = token[2:-2]
            categoria, campo = (miolo.split(".", 1) + [""])[:2]
            categoria = str(categoria).strip() or "Geral"
            campo = str(campo).strip() or label
        if categoria not in category_order:
            category_order.append(categoria)
        entries.append(
            {
                "categoria": categoria,
                "campo": campo,
                "descricao": label or campo,
                "token": token,
            }
        )
    return entries, category_order


def _load_merge_fields_payload() -> dict:
    source = "legacy_fallback"
    try:
        entries, category_order = _merge_fields_from_snapshot()
        if entries:
            source = "snapshot_json"
        else:
            entries, category_order = _merge_fields_from_merge_list_tmp()
            if entries:
                source = "merge_list_tmp"
            else:
                entries, category_order = _merge_fields_from_legacy()
    except Exception:
        logger.exception("Falha ao carregar campos de mesclagem; usando fallback legado.")
        entries, category_order = _merge_fields_from_legacy()
        source = "legacy_fallback"

    grouped: dict[str, list[dict]] = {}
    for item in entries:
        cat = item["categoria"]
        grouped.setdefault(cat, []).append(
            {
                "campo": item["campo"],
                "descricao": item["descricao"],
                "token": item["token"],
            }
        )
        if cat not in category_order:
            category_order.append(cat)

    categorias: list[dict] = []
    for cat in category_order:
        campos = sorted(grouped.get(cat, []), key=lambda row: _merge_sort_key(row.get("campo", "")))
        if not campos:
            continue
        categorias.append({"nome": cat, "campos": campos})

    flat = [
        {"label": item["descricao"], "token": item["token"]}
        for cat in categorias
        for item in cat["campos"]
    ]
    signature_token = "<<Cirurgião.AssinaturaDigital>>"
    signature_norm = _norm_merge_key("Cirurgião.AssinaturaDigital")
    signature_exists = any(
        _norm_merge_key(item.get("token", "")) == signature_norm
        for cat in categorias
        for item in cat.get("campos", [])
    )
    if not signature_exists:
        target_cat = None
        for cat in categorias:
            if _norm_key(cat.get("nome", "")) == _norm_key("Cirurgião"):
                target_cat = cat
                break
        if target_cat is None:
            target_cat = {"nome": "Cirurgião", "campos": []}
            categorias.append(target_cat)
        target_cat["campos"].append(
            {
                "campo": "AssinaturaDigital",
                "descricao": "Assinatura digital do cirurgião (PDF)",
                "token": signature_token,
            }
        )
        flat.append({"label": "Assinatura digital do cirurgião (PDF)", "token": signature_token})
    default_category = MERGE_DEFAULT_CATEGORY
    if categorias and default_category not in {c["nome"] for c in categorias}:
        default_category = str(categorias[0].get("nome") or MERGE_DEFAULT_CATEGORY)
    _merge_fields_debug_payload_source(source, len(flat), len(categorias))
    return {
        "campos": flat,
        "categorias": categorias,
        "categoria_padrao": default_category,
        "fonte": source,
    }


MERGE_FIELDS_PAYLOAD = _load_merge_fields_payload()


def _normalize_tipo_modelo(value: str | None) -> str:
    raw = str(value or "").strip().lower()
    if raw in TEXT_MODEL_TYPES:
        return raw
    return "outros"


def _normalize_extensao(value: str | None, default: str = ".txt") -> str:
    raw = str(value or "").strip().lower()
    if raw and not raw.startswith("."):
        raw = f".{raw}"
    if raw in TEXT_EXTENSIONS:
        return raw
    return default


def _safe_relative_path(path_rel: str) -> Path | None:
    rel = str(path_rel or "").strip().replace("\\", "/")
    if not rel:
        return None
    root = PROJECT_DIR.resolve()
    candidatos: list[str] = []

    def add_candidate(value: str) -> None:
        clean = str(value or "").strip().replace("\\", "/")
        if clean and clean not in candidatos:
            candidatos.append(clean)

    add_candidate(rel)
    rel_lower = rel.lower()
    for marker in ("saas/storage/modelos/", "storage/modelos/"):
        idx = rel_lower.find(marker)
        if idx >= 0:
            tail = rel[idx + len(marker) :]
            add_candidate(f"storage/modelos/{tail}")
            add_candidate(f"saas/storage/modelos/{tail}")
            break
    first_segment = rel_lower.split("/", 1)[0]
    if first_segment in {"base", "clinicas"}:
        add_candidate(f"storage/modelos/{rel}")
        add_candidate(f"saas/storage/modelos/{rel}")

    for candidato in candidatos:
        path_candidate = Path(candidato)
        abs_path = path_candidate.resolve() if path_candidate.is_absolute() else (PROJECT_DIR / candidato).resolve()
        try:
            if not str(abs_path).startswith(str(root)):
                continue
        except Exception:
            continue
        if abs_path.exists():
            return abs_path

    primeiro = Path(candidatos[0])
    abs_path = primeiro.resolve() if primeiro.is_absolute() else (PROJECT_DIR / candidatos[0]).resolve()
    try:
        if not str(abs_path).startswith(str(root)):
            return None
    except Exception:
        return None
    return abs_path


def _model_file_size(path: Path | None) -> int:
    try:
        if path and path.exists() and path.is_file():
            return int(path.stat().st_size)
    except Exception:
        pass
    return 0


def _normalize_filename_lookup(value: str | None) -> str:
    raw = unicodedata.normalize("NFD", str(value or "").strip().lower())
    raw = "".join(ch for ch in raw if unicodedata.category(ch) != "Mn")
    return "".join(ch for ch in raw if ch.isalnum())


def _candidate_extension_priority(ext: str | None) -> int:
    raw = str(ext or "").strip().lower()
    order = {
        ".mod": 0,
        ".rtf": 1,
        ".html": 2,
        ".htm": 2,
        ".txt": 3,
        ".doc": 4,
        ".docx": 5,
    }
    return order.get(raw, 99)


def _collect_registered_path_candidates(item: ModeloDocumento) -> list[Path]:
    candidatos: list[Path] = []
    original_path = _safe_relative_path(str(getattr(item, "caminho_arquivo", "") or ""))
    if isinstance(original_path, Path):
        candidatos.append(original_path)

    nome_arquivo = str(getattr(item, "nome_arquivo", "") or "").strip()
    if not nome_arquivo:
        return candidatos
    tipo_modelo = _normalize_tipo_modelo(str(getattr(item, "tipo_modelo", "") or "outros"))
    clinica_id = getattr(item, "clinica_id", None)
    origem = str(getattr(item, "origem", "") or "").strip().lower()

    def add_candidate(path: Path) -> None:
        resolved = path.resolve()
        if all(str(existing) != str(resolved) for existing in candidatos):
            candidatos.append(resolved)

    if clinica_id is not None:
        try:
            add_candidate(MODEL_STORAGE_DIR / "clinicas" / str(int(clinica_id)) / tipo_modelo / nome_arquivo)
        except Exception:
            pass
    if clinica_id is None or origem == "base":
        add_candidate(MODEL_STORAGE_DIR / "base" / tipo_modelo / nome_arquivo)
    return candidatos


def _collect_recursive_clinic_candidates(item: ModeloDocumento) -> list[dict]:
    clinica_id = getattr(item, "clinica_id", None)
    if clinica_id is None:
        return []
    try:
        clinic_dir = (MODEL_STORAGE_DIR / "clinicas" / str(int(clinica_id))).resolve()
    except Exception:
        return []
    if not clinic_dir.exists() or not clinic_dir.is_dir():
        return []

    nome_arquivo = str(getattr(item, "nome_arquivo", "") or "").strip()
    nome_lower = nome_arquivo.lower()
    base_name = Path(nome_arquivo).stem
    base_lower = base_name.lower()
    normalized_full = _normalize_filename_lookup(nome_arquivo)
    normalized_base = _normalize_filename_lookup(base_name)
    candidatos: list[dict] = []

    for path in clinic_dir.rglob("*"):
        if not path.is_file():
            continue
        ext = str(path.suffix or "").lower()
        if ext not in RUNTIME_RECURSIVE_CANDIDATE_EXTENSIONS:
            continue
        matches: list[str] = []
        if path.name == nome_arquivo:
            matches.append("nome_exato")
        elif path.name.lower() == nome_lower:
            matches.append("nome_case_insensitive")
        if path.stem.lower() == base_lower and ext in RUNTIME_RECURSIVE_CANDIDATE_EXTENSIONS:
            matches.append("basename_ext_alternativa")
        if normalized_base and _normalize_filename_lookup(path.stem) == normalized_base:
            matches.append("nome_normalizado")
        elif normalized_full and _normalize_filename_lookup(path.name) == normalized_full:
            matches.append("arquivo_normalizado")
        if not matches:
            continue
        candidatos.append(
            {
                "path": path.resolve(),
                "ext": ext,
                "size": _model_file_size(path),
                "matches": sorted(set(matches)),
                "importable": ext in IMPORTABLE_RUNTIME_EXTENSIONS,
                "depth": len(path.relative_to(clinic_dir).parts),
            }
        )
    candidatos.sort(
        key=lambda item: (
            _candidate_extension_priority(item.get("ext")),
            0 if "nome_exato" in item.get("matches", []) else 1,
            item.get("depth", 999),
            str(item.get("path") or "").lower(),
        )
    )
    return candidatos


def _choose_recursive_candidate(candidatos: list[dict]) -> dict | None:
    validos = [item for item in candidatos if item.get("importable") and int(item.get("size") or 0) > 0]
    return validos[0] if validos else None


def _resolve_model_file_info(item: ModeloDocumento) -> dict:
    return shared_resolve_model_file_info(item)


def _legacy_resolve_model_file_info(item: ModeloDocumento) -> dict:
    original_path = _safe_relative_path(str(getattr(item, "caminho_arquivo", "") or ""))
    original_size = _model_file_size(original_path)
    fallback_reason = "caminho_original_vazio"
    if original_path and not original_path.exists():
        fallback_reason = "arquivo_original_inexistente"
    elif original_path and original_path.exists() and original_size <= 0:
        fallback_reason = "arquivo_original_vazio"

    for idx, candidato in enumerate(_collect_registered_path_candidates(item)):
        size = _model_file_size(candidato)
        if size <= 0:
            continue
        source = "exact" if idx == 0 and original_path and str(candidato) == str(original_path) else "registered_alias"
        return {
            "path": candidato,
            "original_path": original_path,
            "original_size": original_size,
            "fallback_reason": "" if source == "exact" else fallback_reason,
            "source": source,
            "recursive_candidates": [],
            "chosen_recursive_candidate": None,
        }

    recursive_candidates = _collect_recursive_clinic_candidates(item)
    recursive_choice = _choose_recursive_candidate(recursive_candidates)
    if recursive_choice:
        return {
            "path": recursive_choice.get("path"),
            "original_path": original_path,
            "original_size": original_size,
            "fallback_reason": fallback_reason,
            "source": "recursive",
            "recursive_candidates": recursive_candidates,
            "chosen_recursive_candidate": recursive_choice,
        }

    nome_arquivo = str(getattr(item, "nome_arquivo", "") or "").strip()
    tipo_modelo = _normalize_tipo_modelo(str(getattr(item, "tipo_modelo", "") or "outros"))
    base_path = (MODEL_STORAGE_DIR / "base" / tipo_modelo / nome_arquivo).resolve() if nome_arquivo else None
    if base_path and _model_file_size(base_path) > 0:
        return {
            "path": base_path,
            "original_path": original_path,
            "original_size": original_size,
            "fallback_reason": fallback_reason,
            "source": "base",
            "recursive_candidates": recursive_candidates,
            "chosen_recursive_candidate": None,
        }

    return {
        "path": original_path,
        "original_path": original_path,
        "original_size": original_size,
        "fallback_reason": fallback_reason,
        "source": "none",
        "recursive_candidates": recursive_candidates,
        "chosen_recursive_candidate": None,
    }


def _resolve_model_file_path(item: ModeloDocumento) -> Path | None:
    info = _resolve_model_file_info(item)
    path = info.get("path") if isinstance(info, dict) else None
    return path if isinstance(path, Path) else None


def _read_text_file(path: Path) -> str:
    for enc in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            return path.read_text(encoding=enc).replace("\x00", "")
        except Exception:
            continue
    return ""


def _editor_textos_debug_preview(value: str, limit: int = 420) -> str:
    text = str(value or "").replace("\u200b", "\\u200B")
    max_len = max(80, int(limit or 420))
    return f"{text[:max_len]}..." if len(text) > max_len else text


def _editor_textos_load_log(label: str, payload: dict) -> None:
    if not EDITOR_TEXTOS_DEBUG:
        return
    try:
        logger.warning("%s %s", label, json.dumps(payload, ensure_ascii=False, default=str))
    except Exception:
        try:
            print(label, payload)
        except Exception:
            pass


def _looks_like_rtf(content: str) -> bool:
    return str(content or "").lstrip().startswith("{\\rtf")


def _normalize_content_format(value: str | None) -> str:
    raw = str(value or "").strip().lower()
    if raw in {"html", "text", "oasis_json"}:
        return raw
    return "text"


def _load_raw_content(item: ModeloDocumento) -> str:
    abs_path = _resolve_model_file_path(item)
    if not abs_path or not abs_path.exists() or not abs_path.is_file():
        return ""
    return _read_text_file(abs_path)


def _rtf_to_text(content: str) -> str:
    rtf = str(content or "")
    if not rtf:
        return ""

    out: list[str] = []
    stack: list[tuple[bool, int]] = []
    ignorable = False
    ucskip = 1
    curskip = 0
    idx = 0

    while idx < len(rtf):
        ch = rtf[idx]
        if ch == "{":
            stack.append((ignorable, ucskip))
            idx += 1
            continue
        if ch == "}":
            if stack:
                ignorable, ucskip = stack.pop()
            idx += 1
            continue
        if ch == "\\":
            idx += 1
            if idx >= len(rtf):
                break
            ctrl = rtf[idx]
            if ctrl in "\\{}":
                if not ignorable and curskip <= 0:
                    out.append(ctrl)
                elif curskip > 0:
                    curskip -= 1
                idx += 1
                continue
            if ctrl == "*":
                ignorable = True
                idx += 1
                continue
            if ctrl == "'":
                if idx + 2 < len(rtf):
                    hexcode = rtf[idx + 1 : idx + 3]
                    try:
                        decoded = bytes.fromhex(hexcode).decode("cp1252", errors="ignore")
                    except Exception:
                        decoded = ""
                    if not ignorable and curskip <= 0:
                        out.append(decoded)
                    elif curskip > 0:
                        curskip -= 1
                idx += 3
                continue
            m = re.match(r"([a-zA-Z]+)(-?\d+)? ?", rtf[idx:])
            if m:
                word = m.group(1) or ""
                arg_txt = m.group(2)
                idx += len(m.group(0))
                if word in {"par", "line"} and not ignorable:
                    out.append("\n")
                elif word == "tab" and not ignorable:
                    out.append("\t")
                elif word == "uc" and arg_txt:
                    try:
                        ucskip = max(0, int(arg_txt))
                    except Exception:
                        ucskip = 1
                elif word == "u" and arg_txt:
                    try:
                        codepoint = int(arg_txt)
                        if codepoint < 0:
                            codepoint += 65536
                        if not ignorable:
                            out.append(chr(codepoint))
                        curskip = ucskip
                    except Exception:
                        pass
                elif word in RTF_DESTINATIONS_TO_IGNORE:
                    ignorable = True
                continue
            idx += 1
            continue
        if curskip > 0:
            curskip -= 1
            idx += 1
            continue
        if not ignorable:
            out.append(ch)
        idx += 1

    text = "".join(out)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text


def _rtf_to_html(content: str) -> str:
    rtf = str(content or "")
    if not rtf:
        return "<p></p>"

    groups, controls = _scan_rtf_structure(rtf)
    group_at = {group["start"]: group for group in groups}
    list_hints = {}
    for item in _rtf_list_group_kinds(rtf, groups, controls):
        if item["kind"]:
            list_hints[item["group"]["start"]] = (item["kind"], 0)
    image_groups = {}
    image_keys = {}
    for group in groups:
        destination = group["destination"]
        if destination in {"pict", "shppict", "nonshppict"}:
            image_groups[group["start"]] = group
            raw_group = rtf[group["start"]:group["end"] or group["start"]]
            image_keys[group["start"]] = "rtf-image:" + hashlib.sha256(re.sub(r"\s+", "", raw_group).lower().encode("utf-8")).hexdigest()
        elif destination == "wptools":
            raw_group = rtf[group["start"]:group["end"] or group["start"]]
            if re.search(r"TWPOImage|5457504F496D616765", raw_group, flags=re.IGNORECASE):
                image_groups[group["start"]] = group
                image_keys[group["start"]] = "wptools-image:" + hashlib.sha256(re.sub(r"\s+", "", raw_group).lower().encode("utf-8")).hexdigest()
        elif destination == "field":
            instruction = _rtf_field_instruction(rtf, groups, group)
            feature_id, _ = _rtf_field_kind(instruction)
            if feature_id == "field_linked_image":
                image_groups[group["start"]] = group
                raw_group = rtf[group["start"]:group["end"] or group["start"]]
                match = re.search(r"\bINCLUDEPICTURE\s+([\"'])(.*?)\1", raw_group, flags=re.IGNORECASE | re.DOTALL)
                if match and match.group(2).strip():
                    source_path = re.sub(r"\\\\", r"\\", match.group(2).strip())
                    logical_path = re.sub(r"[\\/]+", "/", source_path).casefold()
                    image_keys[group["start"]] = "linked-image:" + logical_path
                else:
                    image_keys[group["start"]] = "linked-image-group:" + hashlib.sha256(re.sub(r"\s+", "", raw_group).lower().encode("utf-8")).hexdigest()

    out: list[str] = []
    stack: list[tuple[bool, int, dict, str, int | None, float | None, dict, list, str, list]] = []
    ignorable = False
    ucskip = 1
    curskip = 0
    state = {"b": False, "i": False, "u": False}
    rendered_state = {"b": False, "i": False, "u": False}
    align = "left"
    para_open = False
    para_has_content = False
    para_list_hint = None
    pending_list_hint = None
    paragraph_indents = {"left": None, "right": None, "first": None}
    paragraph_layout = {"before": None, "after": None, "line": None, "line_raw": None, "line_rule": None, "line_mult": None, "borders": {}, "between": None}
    paragraph_tabs: list[dict] = []
    pending_tab_alignment = "left"
    border_target: list[str] = []
    seen_image_keys: set[str] = set()
    font_names = _rtf_font_names(rtf)
    default_font_match = re.search(r"\\deff(\d+)", rtf, flags=re.IGNORECASE)
    font_id = int(default_font_match.group(1)) if default_font_match else None
    font_size_pt = None
    font_span_open = False
    table_open = False
    table_row_open = False
    table_cell_open = False
    image_placeholder_in_cell = False
    idx = 0

    def normalize_align(value: str) -> str:
        if value == "center":
            return "center"
        if value == "right":
            return "right"
        if value == "justify":
            return "justify"
        return "left"

    def open_para() -> None:
        nonlocal para_open, para_has_content, para_list_hint, pending_list_hint
        if para_open:
            return
        style = ""
        if align != "left":
            style = f' style="text-align:{align}"'
        attrs = ""
        if pending_list_hint:
            kind, level = pending_list_hint
            attrs = f' data-rtf-list-kind="{kind}" data-rtf-list-level="{level}"'
            para_list_hint = pending_list_hint
            pending_list_hint = None
        indent_attrs = "".join(
            f' data-rtf-indent-{key}-pt="{value:g}"'
            for key, value in paragraph_indents.items()
            if value is not None
        )
        layout_attrs = "".join(
            f' data-rtf-spacing-{key}-pt="{paragraph_layout[key]:g}"'
            for key in ("before", "after") if paragraph_layout[key] is not None
        )
        if paragraph_layout["line"] is not None:
            layout_attrs += f' data-rtf-line-spacing="{paragraph_layout["line"]:g}" data-rtf-line-rule="{paragraph_layout["line_rule"] or "exact"}"'
        if paragraph_tabs:
            layout_attrs += f' data-rtf-tabs="{html_escape(json.dumps(paragraph_tabs, separators=(",", ":")), quote=True)}"'
        if paragraph_layout["borders"]:
            layout_attrs += f' data-rtf-borders="{html_escape(json.dumps(paragraph_layout["borders"], separators=(",", ":")), quote=True)}"'
        if paragraph_layout["between"]:
            layout_attrs += f' data-rtf-border-between="{html_escape(json.dumps(paragraph_layout["between"], separators=(",", ":")), quote=True)}"'
        out.append(f"<p{attrs}{indent_attrs}{layout_attrs}{style}>")
        para_open = True
        para_has_content = False
        apply_state(state)

    def close_font_span() -> None:
        nonlocal font_span_open
        if font_span_open:
            out.append("</span>")
            font_span_open = False

    def open_font_span() -> None:
        nonlocal font_span_open
        if font_span_open:
            return
        family = font_names.get(font_id) if font_id is not None else None
        if family is None and font_size_pt is None:
            return
        attrs = ""
        if family:
            attrs += f' data-rtf-font-family="{html_escape(family, quote=True)}"'
        if font_size_pt is not None and 0 < font_size_pt <= 200:
            attrs += f' data-rtf-font-size-pt="{font_size_pt:g}"'
        out.append(f"<span{attrs}>")
        font_span_open = True

    def discard_empty_para() -> None:
        nonlocal para_open, para_has_content, para_list_hint
        if not para_open or para_has_content:
            return
        if out and out[-1] == "</p>":
            out.pop()
        if out and out[-1].startswith("<p"):
            out.pop()
        para_open = False
        para_list_hint = None

    def close_para() -> None:
        nonlocal para_open, para_has_content, para_list_hint, state
        if para_open:
            logical_state = state.copy()
            apply_state({"b": False, "i": False, "u": False})
            state = logical_state
            close_font_span()
            out.append("</p>")
            para_open = False
            para_has_content = False
            para_list_hint = None

    def close_table() -> None:
        nonlocal table_open
        if table_open:
            out.append("</tbody></table>")
            table_open = False

    def append_text(value: str) -> None:
        nonlocal para_has_content
        open_para()
        open_font_span()
        out.append(value)
        if value:
            para_has_content = True

    def apply_state(target: dict) -> None:
        nonlocal state, rendered_state
        # fecha primeiro na ordem inversa
        if para_open and rendered_state["u"] and not target["u"]:
            out.append("</u>")
        if para_open and rendered_state["i"] and not target["i"]:
            out.append("</em>")
        if para_open and rendered_state["b"] and not target["b"]:
            out.append("</strong>")
        # abre na ordem fixa
        if para_open and not rendered_state["b"] and target["b"]:
            out.append("<strong>")
        if para_open and not rendered_state["i"] and target["i"]:
            out.append("<em>")
        if para_open and not rendered_state["u"] and target["u"]:
            out.append("<u>")
        state = {"b": bool(target["b"]), "i": bool(target["i"]), "u": bool(target["u"])}
        if para_open:
            rendered_state = state.copy()

    def break_paragraph() -> None:
        apply_state({"b": False, "i": False, "u": False})
        close_para()
        open_para()

    while idx < len(rtf):
        ch = rtf[idx]
        if ch == "{":
            group = group_at.get(idx)
            if group and idx in list_hints:
                if para_open and not para_has_content:
                    discard_empty_para()
                pending_list_hint = list_hints[idx]
                idx = group["end"] or (idx + 1)
                continue
            if group and idx in image_groups:
                if table_open and not table_cell_open and not table_row_open:
                    close_table()
                image_key = image_keys.get(idx)
                if (table_cell_open and image_placeholder_in_cell) or (image_key and image_key in seen_image_keys):
                    idx = group["end"] or (idx + 1)
                    continue
                append_text(html_escape("[Imagem não importada]"))
                if image_key:
                    seen_image_keys.add(image_key)
                if table_cell_open:
                    image_placeholder_in_cell = True
                idx = group["end"] or (idx + 1)
                continue
            if group and group["destination"] == "pntext":
                if para_open and not para_has_content:
                    discard_empty_para()
                idx = group["end"] or (idx + 1)
                continue
            stack.append((ignorable, ucskip, state.copy(), align, font_id, font_size_pt, copy.deepcopy(paragraph_layout), paragraph_tabs.copy(), pending_tab_alignment, border_target.copy()))
            idx += 1
            continue
        if ch == "}":
            if stack:
                prev_ignorable, prev_ucskip, prev_state, prev_align, prev_font_id, prev_font_size_pt, prev_layout, prev_tabs, prev_tab_alignment, prev_border_target = stack.pop()
                if not ignorable:
                    if align != prev_align:
                        apply_state({"b": False, "i": False, "u": False})
                        close_para()
                        align = normalize_align(prev_align)
                    apply_state(prev_state)
                if font_id != prev_font_id or font_size_pt != prev_font_size_pt:
                    close_font_span()
                    font_id, font_size_pt = prev_font_id, prev_font_size_pt
                paragraph_layout, paragraph_tabs = prev_layout, prev_tabs
                pending_tab_alignment, border_target = prev_tab_alignment, prev_border_target
                ignorable, ucskip = prev_ignorable, prev_ucskip
            idx += 1
            continue
        if ch in "\r\n":
            idx += 1
            continue
        if ch == "\\":
            idx += 1
            if idx >= len(rtf):
                break
            ctrl = rtf[idx]
            if ctrl in "\\{}":
                if not ignorable and curskip <= 0:
                    append_text(html_escape(ctrl))
                elif curskip > 0:
                    curskip -= 1
                idx += 1
                continue
            if ctrl == "*":
                ignorable = True
                idx += 1
                continue
            if ctrl == "'":
                if idx + 2 < len(rtf):
                    hexcode = rtf[idx + 1 : idx + 3]
                    try:
                        decoded = bytes.fromhex(hexcode).decode("cp1252", errors="ignore")
                    except Exception:
                        decoded = ""
                    if not ignorable and curskip <= 0:
                        append_text(html_escape(decoded))
                    elif curskip > 0:
                        curskip -= 1
                idx += 3
                continue
            m = re.match(r"([a-zA-Z]+)(-?\d+)? ?", rtf[idx:])
            if m:
                word = (m.group(1) or "").lower()
                arg_txt = m.group(2)
                arg_num = int(arg_txt) if arg_txt and arg_txt.lstrip("-").isdigit() else None
                idx += len(m.group(0))

                if word == "trowd" and not ignorable:
                    if para_open and not para_has_content:
                        discard_empty_para()
                    close_para()
                    if not table_open:
                        out.append("<table><tbody>")
                        table_open = True
                    out.append("<tr>")
                    table_row_open = True
                    image_placeholder_in_cell = False
                elif word == "intbl" and not ignorable and table_row_open and not table_cell_open:
                    out.append("<td>")
                    table_cell_open = True
                    image_placeholder_in_cell = False
                elif word == "cell" and not ignorable and table_cell_open:
                    close_para()
                    out.append("</td>")
                    table_cell_open = False
                    image_placeholder_in_cell = False
                elif word == "row" and not ignorable and table_row_open:
                    close_para()
                    if table_cell_open:
                        out.append("</td>")
                        table_cell_open = False
                    out.append("</tr>")
                    table_row_open = False
                elif word == "par" and not ignorable:
                    if table_cell_open:
                        break_paragraph()
                    else:
                        close_table()
                        break_paragraph()
                elif word in {"line"} and not ignorable:
                    open_para()
                    out.append("<br>")
                    para_has_content = True
                elif word == "tab" and not ignorable:
                    append_text("&emsp;")
                elif word in {"tqc", "tqr", "tqdec", "tqbar"} and not ignorable:
                    pending_tab_alignment = {"tqc": "center", "tqr": "right", "tqdec": "decimal", "tqbar": "bar"}[word]
                elif word == "tx" and not ignorable and arg_num is not None:
                    if para_open and not para_has_content:
                        discard_empty_para()
                    paragraph_tabs.append({"positionPt": arg_num / 20, "type": pending_tab_alignment})
                    pending_tab_alignment = "left"
                elif word == "uc" and arg_num is not None:
                    ucskip = max(0, arg_num)
                elif word == "u" and arg_num is not None:
                    if not ignorable:
                        cp = arg_num if arg_num >= 0 else arg_num + 65536
                        append_text(html_escape(chr(cp)))
                    curskip = ucskip
                elif word == "b" and not ignorable:
                    target = state.copy()
                    target["b"] = bool(arg_num is None or arg_num != 0)
                    apply_state(target)
                elif word == "i" and not ignorable:
                    target = state.copy()
                    target["i"] = bool(arg_num is None or arg_num != 0)
                    apply_state(target)
                elif word in {"ul"} and not ignorable:
                    target = state.copy()
                    target["u"] = bool(arg_num is None or arg_num != 0)
                    apply_state(target)
                elif word in {"ulnone", "ul0"} and not ignorable:
                    target = state.copy()
                    target["u"] = False
                    apply_state(target)
                elif word == "ql" and not ignorable:
                    if align != "left":
                        apply_state({"b": False, "i": False, "u": False})
                        close_para()
                        align = "left"
                        open_para()
                elif word == "qc" and not ignorable:
                    if align != "center":
                        apply_state({"b": False, "i": False, "u": False})
                        close_para()
                        align = "center"
                        open_para()
                elif word == "qr" and not ignorable:
                    if align != "right":
                        apply_state({"b": False, "i": False, "u": False})
                        close_para()
                        align = "right"
                        open_para()
                elif word == "qj" and not ignorable:
                    if align != "justify":
                        apply_state({"b": False, "i": False, "u": False})
                        close_para()
                        align = "justify"
                        open_para()
                elif word == "pard" and not ignorable:
                    if table_open and not table_cell_open and not table_row_open:
                        close_table()
                    if para_open and not para_has_content:
                        discard_empty_para()
                    align = "left"
                    paragraph_indents = {"left": None, "right": None, "first": None}
                    paragraph_layout = {"before": None, "after": None, "line": None, "line_raw": None, "line_rule": None, "line_mult": None, "borders": {}, "between": None}
                    paragraph_tabs = []
                    pending_tab_alignment = "left"
                    border_target = []
                elif word == "f" and not ignorable and arg_num is not None:
                    close_font_span()
                    font_id = arg_num
                elif word == "fs" and not ignorable and arg_num is not None:
                    close_font_span()
                    font_size_pt = arg_num / 2
                elif word == "plain" and not ignorable:
                    close_font_span()
                    font_id = int(default_font_match.group(1)) if default_font_match else None
                    font_size_pt = None
                elif word in {"li", "ri", "fi"} and not ignorable and arg_num is not None:
                    key = {"li": "left", "ri": "right", "fi": "first"}[word]
                    if para_open and not para_has_content:
                        discard_empty_para()
                    paragraph_indents[key] = arg_num / 20
                elif word in {"sb", "sa"} and not ignorable and arg_num is not None:
                    if para_open and not para_has_content:
                        discard_empty_para()
                    paragraph_layout["before" if word == "sb" else "after"] = arg_num / 20
                elif word == "sl" and not ignorable and arg_num is not None:
                    if para_open and not para_has_content:
                        discard_empty_para()
                    paragraph_layout["line_raw"] = arg_num
                    if arg_num == 1000 and paragraph_layout.get("line_mult") != 1:
                        # RTF's legacy \sl1000 sentinel means natural single-line
                        # spacing. It is not a literal 1000-twip (50 pt) height.
                        paragraph_layout["line"] = None
                        paragraph_layout["line_rule"] = None
                    else:
                        paragraph_layout["line"] = abs(arg_num) / 240 if paragraph_layout.get("line_mult") == 1 else abs(arg_num) / 20
                        paragraph_layout["line_rule"] = "auto" if paragraph_layout.get("line_mult") == 1 else ("atLeast" if arg_num < 0 else "exact")
                elif word == "slmult" and not ignorable and arg_num is not None:
                    paragraph_layout["line_mult"] = arg_num
                    if paragraph_layout["line_raw"] is not None:
                        raw_line = paragraph_layout["line_raw"]
                        if raw_line == 1000 and arg_num != 1:
                            paragraph_layout["line"] = None
                            paragraph_layout["line_rule"] = None
                        else:
                            paragraph_layout["line"] = abs(raw_line) / 240 if arg_num == 1 else abs(raw_line) / 20
                            paragraph_layout["line_rule"] = "auto" if arg_num == 1 else ("atLeast" if raw_line < 0 else "exact")
                elif word in {"box", "brdrt", "brdrb", "brdrl", "brdrr", "brdrbtw"} and not ignorable:
                    side_map = {"brdrt": "top", "brdrb": "bottom", "brdrl": "left", "brdrr": "right"}
                    if word == "box":
                        border_target = ["top", "right", "bottom", "left"]
                    elif word == "brdrbtw":
                        border_target = ["between"]
                    else:
                        border_target = [side_map[word]]
                elif word == "brdrs" and not ignorable:
                    for side in border_target:
                        target = paragraph_layout["between"] if side == "between" else paragraph_layout["borders"].setdefault(side, {})
                        if isinstance(target, dict):
                            target["style"] = "solid"
                elif word == "brdrw" and not ignorable and arg_num is not None:
                    # RTF border width is expressed in eighths of a point.
                    for side in border_target:
                        target = paragraph_layout["between"] if side == "between" else paragraph_layout["borders"].setdefault(side, {})
                        if isinstance(target, dict):
                            target["widthPt"] = max(0, arg_num / 8)
                elif word in RTF_DESTINATIONS_TO_IGNORE:
                    ignorable = True
                continue
            idx += 1
            continue
        if curskip > 0:
            curskip -= 1
            idx += 1
            continue
        if not ignorable:
            append_text(html_escape(ch))
        idx += 1

    apply_state({"b": False, "i": False, "u": False})
    close_para()
    if table_cell_open:
        out.append("</td>")
    if table_row_open:
        out.append("</tr>")
    close_table()
    html = "".join(out).strip()
    if not html:
        return "<p></p>"
    return html


def _rtf_font_table_and_span(rtf: str) -> tuple[tuple[int, int] | None, dict[int, int]]:
    marker = re.search(r"(?<!\\)\\fonttbl\b", rtf, flags=re.IGNORECASE)
    if not marker:
        return None, {}
    start = rtf.rfind("{", 0, marker.start())
    if start < 0:
        raise ValueError("A tabela de fontes RTF está malformada.")
    depth = 0
    child_start = None
    charsets: dict[int, int] = {}
    idx = start
    while idx < len(rtf):
        char = rtf[idx]
        if char == "\\":
            if idx + 1 < len(rtf) and rtf[idx + 1] == "'":
                idx += 4
            else:
                idx += 2
            continue
        if char == "{":
            if depth == 1:
                child_start = idx
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 1 and child_start is not None:
                entry = rtf[child_start:idx + 1]
                font_id = re.search(r"\\f(\d+)", entry)
                charset = re.search(r"\\fcharset(\d+)", entry, flags=re.IGNORECASE)
                if font_id:
                    charsets[int(font_id.group(1))] = int(charset.group(1)) if charset else 0
                child_start = None
            if depth == 0:
                return (start, idx + 1), charsets
        idx += 1
    raise ValueError("A tabela de fontes RTF está desbalanceada.")


def _rtf_font_names(rtf: str) -> dict[int, str]:
    groups, _ = _scan_rtf_structure(rtf)
    font_table = next((group for group in groups if group["destination"] == "fonttbl"), None)
    if not font_table:
        return {}
    names = {}
    for group in groups:
        if group["parent"] != font_table["id"]:
            continue
        raw = rtf[group["start"]:group["end"] or group["start"]]
        font_id = re.search(r"\\f(\d+)(?![a-zA-Z])", raw)
        if not font_id:
            continue
        decoded = re.sub(
            r"\\'([0-9a-fA-F]{2})",
            lambda match: bytes.fromhex(match.group(1)).decode("cp1252", errors="replace"),
            raw,
        )
        name = re.sub(r"\\[a-zA-Z]+-?\d* ?", "", decoded).replace("{", " ").replace("}", " ").replace(";", " ").strip()
        name = re.sub(r"\s+", " ", name)
        if name and re.fullmatch(r"[\w ,._-]{1,80}", name, flags=re.UNICODE):
            names[int(font_id.group(1))] = name
    return names


_RTF_IGNORABLE_DESTINATIONS = {
    "colortbl", "datastore", "fonttbl", "info", "stylesheet", "themedata",
    "xmlattrname", "xmlattrvalue", "xmlopen", "listtable", "listoverridetable",
    "pnseclvl",
}
_RTF_KNOWN_FORMATTING_CONTROLS = {
    "ansi", "ansicpg", "b", "blue", "cf", "cpg", "deff", "deflang", "deftab",
    "f", "fcharset", "fi", "fs", "froman", "fswiss", "green", "i", "li", "lin",
    "margb", "margf", "margh", "margl", "margr", "margt", "paperh", "paperw",
    "pgwsxn", "pghsxn", "marglsxn", "margrsxn", "margtsxn", "margbsxn", "lndscpsxn",
    "pard", "plain", "ql", "qc", "qr", "qj", "red", "ri", "sa", "sb", "sl",
    "tab", "u", "uc", "ul", "ul0", "ulnone", "rtf", "par", "line", "tx",
    "lang", "langfe", "ltrch", "rtlch", "super", "sub", "nosupersub", "strike",
    "striked", "caps", "scaps", "expnd", "expndtw", "kerning", "outl", "shadow",
    "embo", "impr", "chcbpat", "chcfpat", "highlight", "ulc", "uldb", "uld",
    "ulw", "ulwave", "slmult", "keep", "keepn", "widctlpar", "nowidctlpar",
    "pagew", "pageh", "landscape", "facingp", "margmirror", "viewkind", "viewscale",
    # WPTools version metadata and standard RTF header/footer distances do not
    # carry body content. Header/footer destinations remain structurally guarded.
    "wptoolsver", "headery", "footery",
    # RTF paragraph tab leaders/alignment and paragraph/side borders are
    # presentation controls. The current HTML/Oasis path may approximate or
    # omit their appearance, but they do not carry independent document text.
    "tqc", "tqr", "tqdec", "tqbar", "toc", "brdrbtw", "box", "brdrs",
    "brdrt", "brdrb", "brdrl", "brdrr", "brdrw", "brdrcf", "brsp",
}
_RTF_STRUCTURAL_CONTROL_WORDS = {
    "annotation", "atrfend", "atrfstart", "bin", "cell", "cellx", "endnhere", "field",
    "fldinst", "fldrslt", "footnote", "ftnsep", "ftnsepc", "header", "headerf",
    "headerl", "headerr", "footer", "footerf", "footerl", "footerr", "formfield",
    "ffdata", "ffname", "fftype", "intbl", "listtable", "listoverridetable", "ls",
    "ilvl", "nonshppict", "object", "objdata", "objclass", "page", "pagebb", "pict",
    "pntext", "pntxta", "pntxtb", "pndec", "pnlcltr", "pnlcrm", "pnlvl", "pnseclvl",
    "pnstart", "pnucltr", "pnucrm", "row", "shp", "shpinst", "shppict", "shprslt",
    "shptxt", "trowd", "v", "deleted", "revised", "revauth", "revdttm", "sect",
    "sectd", "trgaph", "trleft", "wptools", "wptable", "wpprheadfoot",
}

# RTF font charsets describe the selected font's character repertoire; they
# are not, by themselves, the document's byte-decoding codepage. ANSI escaped
# bytes continue to be decoded using the document codepage (currently
# Windows-1252 only). These Windows charset identifiers occur in EasyDental
# font tables, including fallback fonts that are not necessarily used for the
# document's Portuguese text.
_RTF_SUPPORTED_FONT_CHARSETS = {
    0,    # ANSI
    1,    # DEFAULT
    2,    # SYMBOL (rendered through its declared font)
    161,  # GREEK
    162,  # TURKISH
    163,  # VIETNAMESE
    177,  # HEBREW
    178,  # ARABIC
    186,  # BALTIC
    204,  # RUSSIAN / CYRILLIC
    238,  # EASTERN EUROPE
}


def _scan_rtf_structure(rtf: str) -> tuple[list[dict], list[dict]]:
    """Tokenize groups/control words so feature decisions ignore escaped text."""
    groups: list[dict] = []
    controls: list[dict] = []
    stack: list[int] = []
    idx = 0
    max_depth = 0
    while idx < len(rtf):
        char = rtf[idx]
        if char == "{":
            parent = stack[-1] if stack else None
            group_id = len(groups)
            groups.append({"id": group_id, "parent": parent, "children": [], "start": idx, "end": None, "destination": None, "ignorable": False})
            if parent is not None:
                groups[parent]["children"].append(group_id)
            stack.append(group_id)
            max_depth = max(max_depth, len(stack))
            if max_depth > 256:
                raise ValueError("O RTF excede a profundidade máxima segura de grupos.")
            idx += 1
            continue
        if char == "}":
            if not stack:
                raise ValueError("O RTF possui grupos desbalanceados.")
            groups[stack.pop()]["end"] = idx + 1
            idx += 1
            continue
        if char != "\\":
            idx += 1
            continue
        if idx + 1 >= len(rtf):
            raise ValueError("O RTF termina em uma sequência de escape incompleta.")
        next_char = rtf[idx + 1]
        if next_char == "'":
            if idx + 3 >= len(rtf) or not re.fullmatch(r"[0-9a-fA-F]{2}", rtf[idx + 2:idx + 4]):
                raise ValueError("O RTF contém um escape hexadecimal inválido.")
            idx += 4
            continue
        if next_char in "{}\\":
            idx += 2
            continue
        if next_char == "*":
            if stack:
                groups[stack[-1]]["ignorable"] = True
            idx += 2
            continue
        if not next_char.isalpha():
            idx += 2
            continue
        match = re.match(r"([a-zA-Z]+)(-?\d+)? ?", rtf[idx + 1:])
        if not match:
            raise ValueError("O RTF contém uma palavra de controle inválida.")
        word = match.group(1).lower()
        argument = int(match.group(2)) if match.group(2) else None
        token = {"word": word, "argument": argument, "start": idx, "group": stack[-1] if stack else None}
        controls.append(token)
        if stack:
            current_group = groups[stack[-1]]
            if current_group["destination"] is None:
                current_group["destination"] = word
        idx += 1 + len(match.group(0))
        if word == "bin":
            if argument is None or argument < 0 or idx + argument > len(rtf):
                raise ValueError("O RTF contém um bloco binário com tamanho inválido.")
            idx += argument
    if stack:
        raise ValueError("O RTF possui grupos desbalanceados.")
    roots = [group for group in groups if group["parent"] is None]
    if len(roots) != 1 or rtf[:roots[0]["start"]].strip() or rtf[roots[0]["end"]:].strip():
        raise ValueError("O RTF precisa conter um único grupo de documento completo.")
    return groups, controls


def _rtf_group_is_within(groups: list[dict], group_id: int | None, destinations: set[str]) -> bool:
    while group_id is not None:
        group = groups[group_id]
        if group["destination"] in destinations:
            return True
        group_id = group["parent"]
    return False


def _rtf_group_descends_from(groups: list[dict], group_id: int, ancestor_id: int) -> bool:
    parent = groups[group_id]["parent"]
    while parent is not None:
        if parent == ancestor_id:
            return True
        parent = groups[parent]["parent"]
    return False


def _rtf_field_instruction(rtf: str, groups: list[dict], field_group: dict) -> str:
    instruction_groups = [
        group for group in groups
        if group["destination"] == "fldinst" and _rtf_group_descends_from(groups, group["id"], field_group["id"])
    ]
    if not instruction_groups:
        return ""
    raw = rtf[instruction_groups[0]["start"]:instruction_groups[0]["end"] or instruction_groups[0]["start"]]
    return re.sub(r"\\[a-zA-Z]+-?\d* ?", " ", raw).replace("{", " ").replace("}", " ").upper()


def _rtf_field_kind(instruction: str) -> tuple[str, str]:
    if re.search(r"\bINCLUDEPICTURE\b", instruction):
        return "field_linked_image", "imagem vinculada por campo do documento"
    if re.search(r"\bMERGEFIELD\b", instruction):
        return "field_merge", "campo Word de mesclagem"
    if re.search(r"\bHYPERLINK\b", instruction):
        return "field_hyperlink", "hiperlink estruturado"
    if re.search(r"\b(?:DATE|TIME|PAGE|NUMPAGES|SECTION|REF|SEQ|FORMTEXT|FORMCHECKBOX)\b", instruction):
        return "field_dynamic", "campo Word dinâmico"
    return "field_unknown", "campo Word sem semântica reconhecida"


def _rtf_list_group_kinds(rtf: str, groups: list[dict], controls: list[dict]) -> list[dict]:
    """Recognize only explicit legacy list instances with a known marker type."""
    candidates = [
        group for group in groups
        if group["destination"] in {"pn", "pntext"}
        and not _rtf_group_is_within(groups, group["parent"], {"pnseclvl", "listtable", "listoverridetable"})
    ]
    result = []
    for group in candidates:
        inside = [
            token for token in controls
            if group["start"] < token["start"] < (group["end"] or group["start"])
            and token["word"] in {"pnlvlblt", "pndec", "pnucltr", "pnucrm", "pnlcltr", "pnlcrm"}
        ]
        kind = "bullet" if any(token["word"] == "pnlvlblt" for token in inside) else ("ordered" if inside else None)
        if group["destination"] == "pntext" or kind:
            result.append({"group": group, "kind": kind})
    for item in result:
        if item["kind"]:
            continue
        group = item["group"]
        peers = [other for other in result if other["kind"] and abs(other["group"]["start"] - group["start"]) <= 512]
        if peers:
            item["kind"] = min(peers, key=lambda other: abs(other["group"]["start"] - group["start"]))["kind"]
    return result


def _rtf_table_structure_is_supported(controls: list[dict], groups: list[dict]) -> bool:
    visible = [token for token in controls if not _rtf_group_is_within(groups, token["group"], _RTF_IGNORABLE_DESTINATIONS)]
    in_row = False
    expected_cells = actual_cells = 0
    saw_table = False
    for token in visible:
        word = token["word"]
        if word == "trowd":
            if in_row:
                return False
            in_row = True
            expected_cells = actual_cells = 0
            saw_table = True
        elif word == "cellx" and in_row:
            expected_cells += 1
        elif word == "cell" and in_row:
            actual_cells += 1
        elif word == "row":
            if not in_row or expected_cells == 0 or actual_cells != expected_cells:
                return False
            in_row = False
        elif word in {"intbl", "cellx", "cell", "row"} and not in_row:
            return False
    return saw_table and not in_row


def analyze_rtf_capabilities(content: str) -> dict:
    """Single source of truth for safe/partial/unsupported RTF import decisions."""
    rtf = str(content or "")
    if len(rtf) > 2_000_000:
        return {"classification": "RTF_INVALID", "supported": False, "features": [], "cosmetic_loss_features": [], "structural_loss_features": [], "warnings": [], "reason": "O arquivo RTF excede o limite seguro de 2 MB de texto."}
    normalized_rtf = rtf.rstrip(" \t\r\n\x00")
    trailing_padding = rtf[len(normalized_rtf):]
    if len(trailing_padding) > 16 or "\x00" in normalized_rtf:
        return {"classification": "RTF_INVALID", "supported": False, "features": [], "cosmetic_loss_features": [], "structural_loss_features": [], "warnings": [], "reason": "O RTF contém bytes nulos fora do preenchimento final permitido; a importação foi bloqueada."}
    rtf = normalized_rtf
    if not re.match(r"^\s*\{\\rtf\d+(?=[\\\s{}])", rtf):
        return {"classification": "RTF_INVALID", "supported": False, "features": [], "cosmetic_loss_features": [], "structural_loss_features": [], "warnings": [], "reason": "O conteúdo não possui um cabeçalho RTF válido."}

    try:
        groups, controls = _scan_rtf_structure(rtf)
    except ValueError as exc:
        return {"classification": "RTF_INVALID", "supported": False, "features": [], "cosmetic_loss_features": [], "structural_loss_features": [], "warnings": [], "reason": str(exc)}

    codepages = {token["argument"] for token in controls if token["word"] in {"ansicpg", "cpg"} and token["argument"] is not None}
    if codepages - {1252}:
        return {"classification": "RTF_INVALID", "supported": False, "features": [], "cosmetic_loss_features": [], "structural_loss_features": [], "warnings": [], "reason": "Este RTF declara uma codepage diferente de Windows-1252; a importação foi bloqueada para evitar corrupção de texto."}

    font_span, font_charsets = _rtf_font_table_and_span(rtf)
    body_for_font_use = rtf if not font_span else rtf[:font_span[0]] + rtf[font_span[1]:]
    used_fonts = {int(value) for value in re.findall(r"\\f(\d+)(?![a-zA-Z])", body_for_font_use)}
    default_font = re.search(r"\\deff(\d+)", body_for_font_use, flags=re.IGNORECASE)
    if default_font:
        used_fonts.add(int(default_font.group(1)))
    if font_span and used_fonts - set(font_charsets):
        return {"classification": "RTF_INVALID", "supported": False, "features": [], "cosmetic_loss_features": [], "structural_loss_features": [], "warnings": [], "reason": "Este RTF seleciona uma fonte sem codificação verificável; a importação foi bloqueada para evitar corrupção de caracteres."}
    used_charsets = {font_charsets[font_id] for font_id in used_fonts if font_id in font_charsets}
    if used_charsets - _RTF_SUPPORTED_FONT_CHARSETS:
        return {"classification": "RTF_INVALID", "supported": False, "features": [], "cosmetic_loss_features": [], "structural_loss_features": [], "warnings": [], "reason": "Este RTF usa um charset de fonte não suportado; a importação foi bloqueada para evitar corrupção de caracteres."}

    features: set[str] = {"text"}
    cosmetic: set[str] = set()
    structural: dict[str, str] = {}
    visible_controls = [token for token in controls if not _rtf_group_is_within(groups, token["group"], _RTF_IGNORABLE_DESTINATIONS)]
    words = {token["word"] for token in visible_controls}

    if words & {"par", "line"}:
        features.add("paragraphs_and_line_breaks")
    if re.search(r"<<[^<>\r\n]{1,120}>>", _rtf_to_text(rtf)):
        features.add("literal_merge_tokens")
    if "\x00" in trailing_padding:
        features.add("trailing_legacy_padding_removed")
    if words & {"tab", "deftab", "tx"}:
        features.add("tabs_approximated")
        cosmetic.add("tab_alignment")
    if words & {"f", "fs", "deff"}:
        cosmetic.add("font_family_or_size")
    if words & {
        "b", "i", "ul", "ul0", "ulnone", "ulc", "uldb", "uld", "ulw", "ulwave",
        "strike", "striked", "super", "sub", "nosupersub", "caps", "scaps",
        "expnd", "expndtw", "kerning", "outl", "shadow", "embo", "impr",
        "chcbpat", "chcfpat", "highlight", "cf",
    }:
        cosmetic.add("inline_character_formatting")
    if words & {"ql", "qc", "qr", "qj"}:
        cosmetic.add("paragraph_alignment")
    if words & {"li", "ri", "fi", "lin", "rin", "sa", "sb", "sl", "slmult", "keep", "keepn", "widctlpar", "nowidctlpar"}:
        cosmetic.add("paragraph_spacing_or_indents")
    if words & {"lang", "langfe", "ltrch"}:
        cosmetic.add("language_or_text_direction")
    if words & {"tqc", "tqr", "tqdec", "tqbar"}:
        cosmetic.add("tab_alignment")
    if "toc" in words:
        cosmetic.add("paragraph_style_metadata")
    if words & {"brdrbtw", "box", "brdrs", "brdrt", "brdrb", "brdrl", "brdrr", "brdrw", "brdrcf", "brsp"}:
        cosmetic.add("paragraph_borders")
    if words & {"margl", "margr", "margt", "margb", "margf", "margh", "paperw", "paperh", "landscape", "pgwsxn", "pghsxn", "marglsxn", "margrsxn", "margtsxn", "margbsxn", "lndscpsxn", "headery", "footery"}:
        cosmetic.add("page_geometry")
    if "wptoolsver" in words:
        features.add("wptools_version_metadata")

    field_groups = [group for group in groups if group["destination"] == "field"]
    for field_group in field_groups:
        instruction = _rtf_field_instruction(rtf, groups, field_group)
        feature_id, label = _rtf_field_kind(instruction)
        if feature_id == "field_linked_image":
            features.add("image_placeholder")
            cosmetic.add("image_placeholder")
        else:
            structural[feature_id] = label

    table_words = {"trowd", "intbl", "cellx", "trgaph", "trleft", "wptable", "cell", "row"}
    if words & table_words:
        if _rtf_table_structure_is_supported(controls, groups):
            features.add("simple_table")
        else:
            structural["table_unsupported_shape"] = "estrutura de tabela fora do subconjunto experimental suportado"
    elif "wptable" in words:
        structural["wptable_without_table"] = "estrutura WPTools de tabela sem linhas RTF recuperáveis"
    image_destinations = {"pict", "shppict", "nonshppict"}
    if any(group["destination"] in image_destinations for group in groups) or words & image_destinations:
        features.add("image_placeholder")
        cosmetic.add("image_placeholder")
    if words & {"object", "objdata", "objclass"} or any(group["destination"] == "object" for group in groups):
        structural["object"] = "objeto incorporado"
    for group in groups:
        if group["destination"] == "wptools":
            group_text = rtf[group["start"]:group["end"] or group["start"]]
            if re.search(r"TWPOImage|5457504F496D616765", group_text, flags=re.IGNORECASE):
                features.add("image_placeholder")
                cosmetic.add("image_placeholder")
            else:
                structural["wptools_payload"] = "conteúdo proprietário estrutural do formato legado"
    list_instances = _rtf_list_group_kinds(rtf, groups, controls)
    if list_instances:
        if any(item["kind"] not in {"bullet", "ordered"} for item in list_instances):
            structural["list_instance_unknown"] = "instância de lista sem marcador reconhecido"
        else:
            features.add("list_instances")
    elif words & {"ls", "ilvl"}:
        structural["list_instance_unknown"] = "referência de lista sem definição de instância suportada"
    elif any(group["destination"] in {"pnseclvl", "listtable", "listoverridetable"} for group in groups) or words & {"listtable", "listoverridetable", "pntxta", "pntxtb", "pndec", "pnlcltr", "pnlcrm", "pnlvl", "pnstart", "pnucltr", "pnucrm"}:
        features.add("list_definitions_metadata_only")
    if words & {"page", "pagebb", "sect", "sectd"}:
        structural["page_break_or_section"] = "quebra de página ou seção"
    wpprheadfoot = [token for token in visible_controls if token["word"] == "wpprheadfoot"]
    has_standard_header_footer = any(group["destination"] in {"header", "headerf", "headerl", "headerr", "footer", "footerf", "footerl", "footerr"} for group in groups)
    if has_standard_header_footer or any(token["argument"] != 0 for token in wpprheadfoot):
        structural["header_footer"] = "cabeçalho ou rodapé não coberto pelo marcador WPTools zero"
    elif wpprheadfoot:
        features.add("wpprheadfoot0_metadata")
    if any(group["destination"] in {"annotation", "atrfstart", "atrfend", "footnote", "endnote"} for group in groups):
        structural["annotation_or_note"] = "anotação ou nota vinculada"
    if words & {"v", "deleted", "revised", "revauth", "revdttm"}:
        structural["hidden_or_revision_text"] = "texto oculto ou alterações controladas"
    if "rtlch" in words:
        structural["right_to_left_text"] = "texto com direção da direita para a esquerda"
    if any(token["word"] == "bin" for token in visible_controls):
        structural["binary_payload"] = "conteúdo binário incorporado"

    known_words = _RTF_KNOWN_FORMATTING_CONTROLS | _RTF_STRUCTURAL_CONTROL_WORDS | {
        "fonttbl", "colortbl", "datastore", "themedata", "stylesheet", "info", "fldinst", "fldrslt",
        "pict", "shppict", "nonshppict", "field", "object", "objdata", "objclass", "formfield",
        "ffdata", "ffname", "fftype", "cellx", "row", "cell", "bin", "listtable", "listoverridetable",
        "trowd", "intbl", "trgaph", "trleft", "wptools", "wptable", "wpprheadfoot", "easy", "logo",
        "sectdefaultcl", "endnhere", "pnhang", "pnindent", "pn", "pnlvlblt", "pnf", "pnfs",
    }
    unsupported_group_destinations = {
        "annotation", "atrfend", "atrfstart", "field", "fldinst", "fldrslt", "footnote", "ftnsep",
        "ftnsepc", "header", "headerf", "headerl", "headerr", "footer", "footerf", "footerl",
        "footerr", "listtable", "listoverridetable", "nonshppict", "object", "pict", "shppict",
        "wptools", "pn", "pntext", "pnseclvl",
    }
    unknown_controls: list[str] = []
    for token in visible_controls:
        # This control is safe as a document-root WPTools version marker only.
        # Do not treat similarly named nested payload controls as ignorable.
        if token["word"] == "wptoolsver" and token["group"] != 0:
            if token["word"] not in unknown_controls:
                unknown_controls.append(token["word"])
            continue
        if token["word"] in known_words or _rtf_group_is_within(groups, token["group"], unsupported_group_destinations):
            continue
        if token["word"] not in {"*"}:
            if token["word"] not in unknown_controls:
                unknown_controls.append(token["word"])
    if unknown_controls:
        structural["unknown_control"] = "controle(s) RTF ainda não suportado(s): " + ", ".join(f"\\{word}" for word in unknown_controls[:8])

    warnings: list[str] = []
    if cosmetic:
        warnings.append("Importação RTF parcial: texto e parágrafos são importados, mas detalhes visuais podem variar no Oasis.")
    warning_by_feature = {
        "image_placeholder": "Imagens RTF não são carregadas; um placeholder textual explícito foi inserido.",
        "font_family_or_size": "Família e tamanho de fonte são transferidos ao Oasis; a renderização pode variar conforme fontes disponíveis.",
        "inline_character_formatting": "Negrito, itálico, sublinhado e outros estilos inline podem variar.",
        "paragraph_alignment": "Alinhamento, recuos e espaçamentos básicos são transferidos ao Oasis; diferenças de renderização ainda podem ocorrer.",
        "paragraph_spacing_or_indents": "Recuos e espaçamentos RTF básicos são mapeados; detalhes avançados de layout podem variar.",
        "tab_alignment": "Tabulações: stops declarados são transferidos ao Oasis; cada controle de tabulação no texto usa espaçamento visual aproximado.",
        "page_geometry": "A geometria física e as margens RTF são aplicadas; detalhes avançados de seção podem variar.",
        "paragraph_style_metadata": "Metadados de nível/estilo de sumário do parágrafo são preservados como texto, mas a semântica de navegação/sumário não é recriada.",
        "paragraph_borders": "Bordas simples são mapeadas; cor, espaçamento, bordas entre parágrafos e variantes avançadas podem variar.",
    }
    warnings.extend(warning_by_feature[item] for item in sorted(cosmetic) if item in warning_by_feature)
    unsupported_labels = list(dict.fromkeys(structural.values()))
    reason = ""
    if structural:
        details = ", ".join(unsupported_labels)
        reason = f"Este documento contém recursos que ainda não podem ser importados com segurança: {details}. O original foi preservado."
        classification = "RTF_UNSUPPORTED_STRUCTURED"
        supported = False
    elif cosmetic:
        classification = "RTF_PARTIAL_FORMATTING"
        supported = True
    else:
        classification = "RTF_SAFE_TEXTUAL"
        supported = True
    return {
        "detected_format": "rtf",
        "classification": classification,
        "supported": supported,
        "features": sorted(features | set(cosmetic) | set(structural)),
        "cosmetic_loss_features": sorted(cosmetic),
        "structural_loss_features": sorted(structural),
        "warnings": warnings,
        "reason": reason,
    }


def _validate_rtf_import_source(content: str) -> list[str]:
    analysis = analyze_rtf_capabilities(content)
    if not analysis["supported"]:
        raise ValueError(analysis["reason"])
    return analysis["warnings"]


def _convert_rtf_for_import(content: str) -> dict:
    analysis = analyze_rtf_capabilities(content)
    if not analysis["supported"]:
        raise ValueError(analysis["reason"])
    rtf_for_conversion = str(content or "").rstrip(" \t\r\n\x00")
    page_config = _rtf_page_config(rtf_for_conversion)
    return {
        "html": _rtf_to_html(rtf_for_conversion),
        "warnings": analysis["warnings"],
        "format": "rtf",
        "persisted": False,
        "classification": analysis["classification"],
        "features": analysis["features"],
        "page_config": page_config,
        "page_settings": _rtf_page_settings(page_config) if page_config else None,
    }


def _rtf_page_config(rtf: str) -> dict | None:
    """Extract effective standard RTF page geometry; values in page_config are mm."""
    try:
        _, controls = _scan_rtf_structure(rtf)
    except ValueError:
        return None

    base_words = {"paperw": "largura_mm", "paperh": "altura_mm", "margl": "margem_esquerda_mm", "margr": "margem_direita_mm", "margt": "margem_superior_mm", "margb": "margem_inferior_mm"}
    section_words = {"pgwsxn": "largura_mm", "pghsxn": "altura_mm", "marglsxn": "margem_esquerda_mm", "margrsxn": "margem_direita_mm", "margtsxn": "margem_superior_mm", "margbsxn": "margem_inferior_mm"}
    twips = {"largura_mm": 12240, "altura_mm": 15840, "margem_esquerda_mm": 1440, "margem_direita_mm": 1440, "margem_superior_mm": 1440, "margem_inferior_mm": 1440}
    section_values: dict[str, int] = {}
    orientation = None
    for token in controls:
        word, argument = token["word"], token["argument"]
        if word in {"landscape", "lndscpsxn"}:
            orientation = "Paisagem" if argument != 0 else "Retrato"
        elif word == "pgnstarts":
            continue
        elif word in base_words and argument is not None:
            twips[base_words[word]] = argument
        elif word in section_words and argument is not None:
            section_values[section_words[word]] = argument
    twips.update(section_values)
    width, height = twips["largura_mm"], twips["altura_mm"]
    if not (1 <= width <= 200000 and 1 <= height <= 200000):
        return None
    if any(value < 0 or value > 200000 for value in twips.values()):
        return None
    effective_orientation = orientation or ("Paisagem" if width > height else "Retrato")
    if (effective_orientation == "Paisagem" and width < height) or (effective_orientation == "Retrato" and width > height):
        twips["largura_mm"], twips["altura_mm"] = height, width
    return {
        "tipo_papel": "Definido pelo usuário",
        "orientacao": effective_orientation,
        **{key: round(value * 25.4 / 1440, 2) for key, value in twips.items()},
    }


def _rtf_page_settings(page_config: dict) -> dict:
    """Translate physical mm geometry to Oasis CSS-pixel document units."""
    mm_to_px = lambda value: round(float(value) * 96 / 25.4, 4)
    return {
        "width": mm_to_px(page_config["largura_mm"]),
        "height": mm_to_px(page_config["altura_mm"]),
        "orientation": "landscape" if page_config["orientacao"] == "Paisagem" else "portrait",
        "margins": {
            "left": mm_to_px(page_config["margem_esquerda_mm"]),
            "right": mm_to_px(page_config["margem_direita_mm"]),
            "top": mm_to_px(page_config["margem_superior_mm"]),
            "bottom": mm_to_px(page_config["margem_inferior_mm"]),
            # The RTF importer does not create header/footer content. Reserving
            # Oasis's 48px defaults here can consume the entire body on a small
            # label page and force every paragraph onto a separate page.
            "header": 0,
            "footer": 0,
            "gutter": 0,
        },
    }


def _escape_rtf_text(text: str) -> str:
    out: list[str] = []
    for ch in str(text or ""):
        if ch == "\\":
            out.append("\\\\")
            continue
        if ch == "{":
            out.append("\\{")
            continue
        if ch == "}":
            out.append("\\}")
            continue
        if ch == "\r":
            continue
        if ch == "\n":
            out.append("\\par ")
            continue
        if ch == "\t":
            out.append("\\tab ")
            continue
        code = ord(ch)
        if 32 <= code <= 126:
            out.append(ch)
            continue
        try:
            encoded = ch.encode("cp1252")
            for b in encoded:
                out.append(f"\\'{b:02x}")
        except Exception:
            out.append(f"\\u{code}?")
    return "".join(out)


class _HtmlToTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        t = (tag or "").lower()
        if t in {"br"}:
            self.parts.append("\n")
        elif t in {"p", "div", "li"}:
            if self.parts:
                self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        t = (tag or "").lower()
        if t in {"p", "div", "li"}:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        self.parts.append(data or "")

    def text(self) -> str:
        raw = html_unescape("".join(self.parts))
        raw = raw.replace("\r\n", "\n").replace("\r", "\n")
        raw = re.sub(r"\n{3,}", "\n\n", raw).strip()
        return raw


class _HtmlToRtfParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.parts: list[str] = []
        self.block_open = False
        self.list_depth = 0
        self.list_ordered_stack: list[bool] = []
        self.list_item_index_stack: list[int] = []
        self.open_tags: list[str] = []

    def _attrs_dict(self, attrs) -> dict:
        return {str(k or "").lower(): str(v or "") for k, v in (attrs or [])}

    def _append_block_break(self) -> None:
        if self.parts and not self.parts[-1].endswith("\\par "):
            self.parts.append("\\par ")

    def _append_alignment(self, attrs: dict) -> None:
        align_attr = str(attrs.get("align", "")).strip().lower()
        style = str(attrs.get("style", "")).strip().lower()
        align_val = align_attr
        if "text-align" in style:
            m = re.search(r"text-align\s*:\s*([a-z]+)", style)
            if m:
                align_val = m.group(1).strip().lower()
        if align_val in {"center", "right", "justify", "left"}:
            cmd = {"left": "\\ql ", "center": "\\qc ", "right": "\\qr ", "justify": "\\qj "}.get(align_val, "\\ql ")
            self.parts.append(cmd)

    def handle_starttag(self, tag: str, attrs) -> None:
        t = (tag or "").lower()
        attrs_map = self._attrs_dict(attrs)
        if t in {"p", "div"}:
            self._append_block_break()
            self._append_alignment(attrs_map)
            self.block_open = True
            return
        if t == "br":
            self.parts.append("\\line ")
            return
        if t in {"strong", "b"}:
            self.parts.append("\\b ")
            self.open_tags.append("b")
            return
        if t in {"em", "i"}:
            self.parts.append("\\i ")
            self.open_tags.append("i")
            return
        if t == "u":
            self.parts.append("\\ul ")
            self.open_tags.append("u")
            return
        if t in {"ul", "ol"}:
            self.list_depth += 1
            self.list_ordered_stack.append(t == "ol")
            self.list_item_index_stack.append(0)
            self._append_block_break()
            return
        if t == "li":
            self._append_block_break()
            bullet = "\\bullet\\tab "
            if self.list_ordered_stack and self.list_ordered_stack[-1]:
                self.list_item_index_stack[-1] += 1
                bullet = f"{self.list_item_index_stack[-1]}.\\tab "
            self.parts.append("\\tab ")
            self.parts.append(bullet)
            self.block_open = True
            return

    def handle_endtag(self, tag: str) -> None:
        t = (tag or "").lower()
        if t in {"strong", "b"}:
            self.parts.append("\\b0 ")
            if self.open_tags and self.open_tags[-1] == "b":
                self.open_tags.pop()
            return
        if t in {"em", "i"}:
            self.parts.append("\\i0 ")
            if self.open_tags and self.open_tags[-1] == "i":
                self.open_tags.pop()
            return
        if t == "u":
            self.parts.append("\\ul0 ")
            if self.open_tags and self.open_tags[-1] == "u":
                self.open_tags.pop()
            return
        if t in {"p", "div", "li"}:
            self._append_block_break()
            self.block_open = False
            return
        if t in {"ul", "ol"}:
            if self.list_ordered_stack:
                self.list_ordered_stack.pop()
            if self.list_item_index_stack:
                self.list_item_index_stack.pop()
            self.list_depth = max(0, self.list_depth - 1)
            self._append_block_break()
            return

    def handle_data(self, data: str) -> None:
        if data:
            self.parts.append(_escape_rtf_text(html_unescape(data)))

    def to_rtf_body(self) -> str:
        body = "".join(self.parts).strip()
        if not body:
            return "\\par "
        return body


def _html_to_text(content: str) -> str:
    parser = _HtmlToTextParser()
    parser.feed(str(content or ""))
    parser.close()
    return parser.text()


def _html_to_rtf(content: str) -> str:
    parser = _HtmlToRtfParser()
    parser.feed(str(content or ""))
    parser.close()
    body = parser.to_rtf_body()
    return "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\viewkind4\\uc1\\pard\\f0\\fs20 " + body + "}"


def _text_to_rtf(text: str) -> str:
    plain = str(text or "").replace("\r\n", "\n").replace("\r", "\n")
    escaped = (
        plain.replace("\\", "\\\\")
        .replace("{", "\\{")
        .replace("}", "\\}")
        .replace("\t", "\\tab ")
        .replace("\n", "\\par\n")
    )
    return "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\f0\\fs20 " + escaped + "}"


def _sanitize_filename(name: str) -> str:
    base = FILENAME_SANITIZE.sub("", str(name or "").strip())
    base = base.strip(". ").strip()
    if not base:
        base = "Novo modelo"
    return base[:120]


def _next_available_filename(db: Session, clinica_id: int, tipo_modelo: str, filename: str) -> str:
    stem = Path(filename).stem
    ext = Path(filename).suffix
    candidate = filename
    counter = 2
    while True:
        exists = (
            db.query(ModeloDocumento.id)
            .filter(
                ModeloDocumento.clinica_id == int(clinica_id),
                ModeloDocumento.tipo_modelo == str(tipo_modelo),
                ModeloDocumento.nome_arquivo == candidate,
            )
            .first()
        )
        if not exists:
            return candidate
        candidate = f"{stem} {counter}{ext}"
        counter += 1


def _serialize_item(item: ModeloDocumento) -> dict:
    return {
        "id": int(item.id),
        "nome": str(item.nome_exibicao or "").strip(),
        "tipo_modelo": str(item.tipo_modelo or "").strip(),
        "nome_arquivo": str(item.nome_arquivo or "").strip(),
        "extensao": str(item.extensao or "").strip().lower(),
        "origem": str(item.origem or "").strip(),
        "sistema": item.clinica_id is None,
    }


def _load_content(item: ModeloDocumento) -> str:
    raw = _load_raw_content(item)
    ext = str(item.extensao or "").strip().lower()
    if ext in RTF_RICH_EXTENSIONS or _looks_like_rtf(raw):
        return _rtf_to_text(raw)
    return raw


def _load_content_bundle_from_path(abs_path: Path | None) -> dict:
    raw = _read_text_file(abs_path) if abs_path and abs_path.exists() and abs_path.is_file() else ""
    ext = str(abs_path.suffix or "").strip().lower() if isinstance(abs_path, Path) else ""
    meta = _load_editor_meta_from_abs(abs_path)
    pagina_cfg = _normalize_page_config(meta.get("pagina_config", {}))
    meta_html = str(meta.get("conteudo_html") or "")
    if str(meta.get("conteudo_formato") or "").strip().lower() == "oasis_json":
        return {"text": raw, "html": "", "format": "oasis_json", "pagina_config": pagina_cfg}
    if ext in {".html", ".htm"}:
        html = meta_html.strip() or raw
        return {
            "text": _html_to_text(html),
            "html": html,
            "format": "html",
            "pagina_config": pagina_cfg,
        }
    if ext in RTF_RICH_EXTENSIONS or _looks_like_rtf(raw):
        if meta_html.strip():
            return {
                "text": _html_to_text(meta_html),
                "html": meta_html,
                "format": "html",
                "pagina_config": pagina_cfg,
            }
        if not raw.strip():
            return {
                "text": "",
                "html": "",
                "format": "html",
                "pagina_config": pagina_cfg,
            }
        html = _rtf_to_html(raw)
        return {
            "text": _rtf_to_text(raw),
            "html": html,
            "format": "html",
            "pagina_config": pagina_cfg,
        }
    return {
        "text": raw,
        "html": meta_html.strip() or "",
        "format": "text",
        "pagina_config": pagina_cfg,
    }


def _resolve_editor_catalog_file(item: ModeloDocumento) -> tuple[Path | None, str]:
    extension = str(item.extensao or "").strip().lower()
    root = (MODEL_STORAGE_DIR / "clinicas" / str(int(item.clinica_id))) if item.clinica_id is not None else (MODEL_STORAGE_DIR / "base")
    if extension in TEXT_EXTENSIONS:
        info = _resolve_model_file_info(item)
        candidate = info.get("path") if isinstance(info, dict) else None
        if isinstance(candidate, Path):
            # The shared resolver already restricts these formats to the tenant/base root.
            safe = registered_catalog_path(candidate, root=root, filename=candidate.name, extension=candidate.suffix)
            if safe is not None:
                return safe, str(info.get("source") or "registered")
    registered = _safe_relative_path(str(item.caminho_arquivo or ""))
    safe = registered_catalog_path(
        registered,
        root=root,
        filename=str(item.nome_arquivo or ""),
        extension=extension,
    )
    if safe is None:
        return None, "invalid_or_unresolved_registered_path"
    return safe, "registered"


def _catalog_diagnostic_response(item: ModeloDocumento, *, extension: str, path: Path | None, reason: str, detected_format: str | None = None, preview: str = "", metadata: dict | None = None) -> dict:
    response = _serialize_item(item)
    file_exists = bool(path and path.is_file())
    size_bytes = 0
    if file_exists:
        try:
            size_bytes = int(path.stat().st_size)
        except OSError:
            file_exists = False
    response.update({
        "conteudo": "",
        "conteudo_html": "",
        "conteudo_formato": "diagnostic",
        "pagina_config": _normalize_page_config((metadata or {}).get("pagina_config", {})),
        "diagnostico": {
            "mode": "diagnostic",
            "read_only": True,
            "file_exists": file_exists,
            "size_bytes": size_bytes,
            "extension": extension,
            "detected_format": detected_format or extension.lstrip("."),
            "reason": reason,
            "preview": str(preview or "")[:MAX_PREVIEW_CHARS],
            "preview_truncated": len(str(preview or "")) > MAX_PREVIEW_CHARS,
            "metadata": {"conteudo_formato": str((metadata or {}).get("conteudo_formato") or "")},
        },
    })
    return response


def _load_catalog_model_detail(item: ModeloDocumento, extension: str, path: Path | None) -> dict:
    if not path or not path.is_file():
        return _catalog_diagnostic_response(item, extension=extension, path=path, reason="Arquivo físico associado ao registro não foi encontrado.", detected_format="missing")

    try:
        size_bytes = int(path.stat().st_size)
    except OSError:
        size_bytes = 0
    if not size_bytes:
        return _catalog_diagnostic_response(item, extension=extension, path=path, reason="Arquivo físico vazio ou inacessível.", detected_format="empty")

    if extension in OFFICE_BINARY_EXTENSIONS:
        return _catalog_diagnostic_response(
            item,
            extension=extension,
            path=path,
            reason="Formato Office/imagem sem conversor seguro. O binário não foi decodificado nem enviado ao editor.",
            detected_format=extension.lstrip("."),
        )

    if extension in SNIFFABLE_CATALOG_EXTENSIONS:
        if size_bytes > MAX_SNIFF_BYTES:
            return _catalog_diagnostic_response(item, extension=extension, path=path, reason="Arquivo excede o limite de inspeção segura; nenhuma conversão foi tentada.", detected_format="oversize")
        try:
            raw_bytes = path.read_bytes()
        except OSError:
            return _catalog_diagnostic_response(item, extension=extension, path=path, reason="Arquivo físico inacessível.", detected_format="unreadable")
        metadata = _load_editor_meta_from_abs(path)
        classification = classify_catalog_bytes(raw_bytes, extension, str(metadata.get("conteudo_formato") or ""))
        if classification["kind"] == "diagnostic":
            return _catalog_diagnostic_response(item, extension=extension, path=path, reason=classification["reason"], detected_format=classification["detected_format"], preview=classification.get("preview", ""), metadata=metadata)
        if classification["kind"] == "oasis_json":
            content = _load_content_bundle_from_path(path)
        elif classification["kind"] == "rtf":
            raw_text = str(classification.get("content") or "")
            content = {"text": _rtf_to_text(raw_text), "html": _rtf_to_html(raw_text), "format": "html", "pagina_config": _normalize_page_config(metadata.get("pagina_config", {}))}
        elif classification["kind"] == "html":
            raw_html = str(classification.get("content") or "")
            content = {"text": _html_to_text(raw_html), "html": raw_html, "format": "html", "pagina_config": _normalize_page_config(metadata.get("pagina_config", {}))}
        else:
            if str(metadata.get("conteudo_html") or "").strip():
                content = _load_content_bundle_from_path(path)
            else:
                content = {"text": str(classification.get("content") or ""), "html": "", "format": "text", "pagina_config": _normalize_page_config(metadata.get("pagina_config", {}))}
        response = _serialize_item(item)
        response.update({"conteudo": content["text"], "conteudo_html": content["html"], "conteudo_formato": content["format"], "pagina_config": content.get("pagina_config"), "conteudo_formato_detectado": classification["detected_format"]})
        return response

    try:
        raw_bytes = path.read_bytes()
    except OSError:
        return _catalog_diagnostic_response(item, extension=extension, path=path, reason="Arquivo físico inacessível.", detected_format="unreadable")
    metadata = _load_editor_meta_from_abs(path)
    classification = classify_catalog_bytes(raw_bytes, extension, str(metadata.get("conteudo_formato") or ""))
    if classification["kind"] == "diagnostic":
        return _catalog_diagnostic_response(item, extension=extension, path=path, reason=classification["reason"], detected_format=classification["detected_format"], preview=classification.get("preview", ""), metadata=metadata)
    content = _load_content_bundle_from_path(path)
    response = _serialize_item(item)
    response.update({"conteudo": content["text"], "conteudo_html": content["html"], "conteudo_formato": content["format"], "pagina_config": content.get("pagina_config"), "conteudo_formato_detectado": classification["detected_format"]})
    return response


def _load_content_bundle(item: ModeloDocumento) -> dict:
    abs_path = _resolve_model_file_path(item)
    return _load_content_bundle_from_path(abs_path)


def _build_clinic_model_path(clinica_id: int, tipo_modelo: str, nome_arquivo: str) -> tuple[str, Path]:
    rel = Path("storage") / "modelos" / "clinicas" / str(int(clinica_id)) / str(tipo_modelo) / str(nome_arquivo)
    abs_path = (PROJECT_DIR / rel).resolve()
    abs_path.parent.mkdir(parents=True, exist_ok=True)
    return rel.as_posix(), abs_path


def _build_editor_meta_path(abs_path: Path) -> Path:
    suffix = str(abs_path.suffix or "")
    if suffix:
        return abs_path.with_suffix(f"{suffix}.editor.json")
    return abs_path.with_name(f"{abs_path.name}.editor.json")


def _to_float(value, default: float) -> float:
    try:
        txt = str(value).strip().replace(",", ".")
        return float(txt)
    except Exception:
        return float(default)


def _normalize_page_config(value) -> dict:
    raw = value if isinstance(value, dict) else {}
    tipo_papel = str(raw.get("tipo_papel", "Definido pelo usuario") or "Definido pelo usuario").strip()
    orientacao_raw = str(raw.get("orientacao", "Retrato") or "Retrato").strip().lower()
    orientacao = "Paisagem" if orientacao_raw == "paisagem" else "Retrato"
    altura = max(1.0, _to_float(raw.get("altura_mm", 279.4), 279.4))
    largura = max(1.0, _to_float(raw.get("largura_mm", 215.9), 215.9))
    margem_sup = max(0.0, _to_float(raw.get("margem_superior_mm", 25.4), 25.4))
    margem_esq = max(0.0, _to_float(raw.get("margem_esquerda_mm", 33.16), 33.16))
    margem_dir = max(0.0, _to_float(raw.get("margem_direita_mm", 33.16), 33.16))
    margem_inf = max(0.0, _to_float(raw.get("margem_inferior_mm", 25.4), 25.4))
    return {
        "tipo_papel": tipo_papel,
        "orientacao": orientacao,
        "altura_mm": round(float(altura), 2),
        "largura_mm": round(float(largura), 2),
        "margem_superior_mm": round(float(margem_sup), 2),
        "margem_inferior_mm": round(float(margem_inf), 2),
        "margem_esquerda_mm": round(float(margem_esq), 2),
        "margem_direita_mm": round(float(margem_dir), 2),
    }


def _load_editor_meta_from_abs(abs_path: Path | None) -> dict:
    if not abs_path or not abs_path.exists() or not abs_path.is_file():
        return {}
    meta_path = _build_editor_meta_path(abs_path)
    if not meta_path.exists() or not meta_path.is_file():
        return {}
    try:
        data = json.loads(meta_path.read_text(encoding="utf-8"))
    except Exception:
        return {}
    return data if isinstance(data, dict) else {}


def _load_editor_meta(item: ModeloDocumento) -> dict:
    abs_path = _resolve_model_file_path(item)
    return _load_editor_meta_from_abs(abs_path)


def _save_editor_meta(abs_path: Path | None, *, conteudo_html=None, conteudo_formato=None, pagina_config=None) -> None:
    if not abs_path:
        return
    meta_path = _build_editor_meta_path(abs_path)
    data = _load_editor_meta_from_abs(abs_path)
    if conteudo_html is not None:
        html = str(conteudo_html or "")
        if html.strip():
            data["conteudo_html"] = html
        else:
            data.pop("conteudo_html", None)
    if conteudo_formato is not None:
        data["conteudo_formato"] = str(conteudo_formato or "text")
    if pagina_config is not None:
        data["pagina_config"] = _normalize_page_config(pagina_config)
    if not data:
        try:
            if meta_path.exists():
                meta_path.unlink()
        except Exception:
            pass
        return
    meta_path.parent.mkdir(parents=True, exist_ok=True)
    meta_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def _find_display_name_conflict(
    db: Session,
    clinica_id: int,
    tipo_modelo: str,
    nome_exibicao: str,
    exclude_id: int | None = None,
) -> ModeloDocumento | None:
    nome = str(nome_exibicao or "").strip()
    if not nome:
        return None
    query = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.clinica_id == int(clinica_id),
            ModeloDocumento.tipo_modelo == str(tipo_modelo),
            ModeloDocumento.ativo.is_(True),
            func.lower(func.trim(ModeloDocumento.nome_exibicao)) == nome.lower(),
        )
    )
    if int(exclude_id or 0) > 0:
        query = query.filter(ModeloDocumento.id != int(exclude_id))
    return query.first()


def _next_available_storage_filename(
    db: Session, clinica_id: int, tipo_modelo: str, filename: str, *, exclude_id: int
) -> str:
    stem = Path(filename).stem
    ext = Path(filename).suffix
    candidate = filename
    counter = 2
    while True:
        registered = (
            db.query(ModeloDocumento.id)
            .filter(
                ModeloDocumento.clinica_id == int(clinica_id),
                ModeloDocumento.tipo_modelo == str(tipo_modelo),
                ModeloDocumento.nome_arquivo == candidate,
                ModeloDocumento.id != int(exclude_id),
            )
            .first()
        )
        physical = MODEL_STORAGE_DIR / "clinicas" / str(int(clinica_id)) / str(tipo_modelo) / candidate
        if not registered and not physical.exists():
            return candidate
        candidate = f"{stem} {counter}{ext}"
        counter += 1


def _ensure_editable_item(db: Session, current_user: Usuario, source: ModeloDocumento) -> ModeloDocumento:
    if int(source.clinica_id or 0) == int(current_user.clinica_id):
        return source
    existing = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.clinica_id == int(current_user.clinica_id),
            ModeloDocumento.tipo_modelo == str(source.tipo_modelo or ""),
            ModeloDocumento.nome_arquivo == str(source.nome_arquivo or ""),
        )
        .first()
    )
    if existing:
        return existing
    rel, abs_path = _build_clinic_model_path(
        int(current_user.clinica_id),
        str(source.tipo_modelo or "outros"),
        str(source.nome_arquivo or "novo.txt"),
    )
    copied_content = _load_raw_content(source)
    source_meta = _load_editor_meta(source)
    ext = str(source.extensao or "").strip().lower()
    if ext in RTF_RICH_EXTENSIONS:
        if _looks_like_rtf(copied_content):
            abs_path.write_text(copied_content, encoding="utf-8")
        else:
            abs_path.write_text(_text_to_rtf(copied_content), encoding="utf-8")
    else:
        abs_path.write_text(copied_content, encoding="utf-8")
    _save_editor_meta(
        abs_path,
        conteudo_html=source_meta.get("conteudo_html"),
        pagina_config=source_meta.get("pagina_config"),
    )
    clone = ModeloDocumento(
        clinica_id=int(current_user.clinica_id),
        tipo_modelo=str(source.tipo_modelo or "outros"),
        codigo=str(source.codigo or ""),
        nome_exibicao=str(source.nome_exibicao or source.nome_arquivo or "Novo modelo"),
        nome_arquivo=str(source.nome_arquivo or "novo.txt"),
        extensao=str(source.extensao or ".txt"),
        caminho_arquivo=rel,
        ativo=True,
        padrao_clinica=bool(source.padrao_clinica),
        origem="clinica",
    )
    db.add(clone)
    db.flush()
    return clone


def _query_visible_models(db: Session, current_user: Usuario):
    rows = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.ativo.is_(True),
            or_(
                ModeloDocumento.clinica_id == int(current_user.clinica_id),
                ModeloDocumento.clinica_id.is_(None),
            ),
            ModeloDocumento.extensao.in_(tuple(EDITOR_CATALOG_EXTENSIONS)),
        )
        .order_by(ModeloDocumento.nome_exibicao.asc(), ModeloDocumento.id.asc())
        .all()
    )
    chosen: dict[tuple[str, str], ModeloDocumento] = {}
    for row in rows:
        key = (
            str(row.tipo_modelo or "").strip().lower(),
            str(row.nome_arquivo or "").strip().lower(),
        )
        prev = chosen.get(key)
        if prev is None:
            chosen[key] = row
            continue
        prev_is_base = prev.clinica_id is None
        cur_is_clinic = int(row.clinica_id or 0) == int(current_user.clinica_id)
        if prev_is_base and cur_is_clinic:
            chosen[key] = row
    items = sorted(
        chosen.values(),
        key=lambda x: (
            str(x.nome_exibicao or "").strip().lower(),
            str(x.tipo_modelo or "").strip().lower(),
            int(x.id or 0),
        ),
    )
    return items


def _find_base_fallback_item(db: Session, item: ModeloDocumento) -> ModeloDocumento | None:
    tipo_modelo = _normalize_tipo_modelo(str(item.tipo_modelo or "outros"))
    nome_arquivo = str(item.nome_arquivo or "").strip()
    query = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.ativo.is_(True),
            ModeloDocumento.clinica_id.is_(None),
            ModeloDocumento.tipo_modelo == tipo_modelo,
        )
    )
    if nome_arquivo:
        base = query.filter(ModeloDocumento.nome_arquivo == nome_arquivo).first()
        if base:
            return base
    nome = str(item.nome_exibicao or "").strip()
    if nome:
        return (
            query.filter(func.lower(func.trim(ModeloDocumento.nome_exibicao)) == nome.lower())
            .order_by(ModeloDocumento.id.asc())
            .first()
        )
    return None


@router.post("/import/rtf")
def importar_rtf_para_oasis(payload: RtfImportPayload):
    """Convert raw RTF text in memory; this endpoint never creates a model or writes a file."""
    try:
        return _convert_rtf_for_import(payload.content)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        logger.warning("RTF import conversion rejected after parser failure: %s", type(exc).__name__)
        raise HTTPException(status_code=422, detail="Não foi possível converter este RTF com segurança.") from exc


@router.post("/mesclar")
def mesclar_texto_editor(
    payload: MesclarTextoPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    formato = _normalize_content_format(payload.conteudo_formato)
    values = _build_merge_values(
        db=db,
        current_user=current_user,
        paciente_id=payload.paciente_id,
        cirurgiao_id=payload.cirurgiao_id,
        extras=payload.extras or {},
    )
    preservar = bool(payload.preservar_nao_resolvido)
    if formato == "html":
        conteudo_mesclado, total, substituidos = _render_merge_html(
            payload.conteudo,
            values,
            preservar_nao_resolvido=preservar,
        )
    else:
        conteudo_mesclado, total, substituidos = _render_merge_text(
            payload.conteudo,
            values,
            preservar_nao_resolvido=preservar,
        )
    return {
        "conteudo": conteudo_mesclado,
        "conteudo_formato": formato,
        "placeholders_detectados": int(total),
        "placeholders_substituidos": int(substituidos),
    }


@router.get("/campos")
def listar_campos_editor_textos(
    current_user: Usuario = Depends(get_current_user),
):
    return {
        "campos": list(MERGE_FIELDS_PAYLOAD.get("campos") or []),
        "categorias": list(MERGE_FIELDS_PAYLOAD.get("categorias") or []),
        "categoria_padrao": str(MERGE_FIELDS_PAYLOAD.get("categoria_padrao") or MERGE_DEFAULT_CATEGORY),
        "fonte": str(MERGE_FIELDS_PAYLOAD.get("fonte") or "legacy_fallback"),
    }


@router.get("/assistente-receitas/contexto")
def obter_contexto_assistente_receitas(
    paciente_id: int | None = Query(default=None),
    q_medicamento: str = Query(default=""),
    medicamentos_limit: int = Query(default=250, ge=1, le=1000),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cirurgioes = _listar_cirurgioes_contexto(db, current_user)
    modelos = _listar_modelos_receituario_contexto(db, current_user)
    tipos_uso = _listar_tipos_uso_contexto(db, current_user)
    medicamentos, medicamentos_fonte = _listar_medicamentos_contexto(
        db,
        current_user,
        q=q_medicamento,
        limit=int(medicamentos_limit or 250),
    )
    paciente = _carregar_paciente_contexto(db, current_user, paciente_id)

    cirurgioes_ids = {int(item["id"]) for item in cirurgioes}
    cirurgiao_padrao_id = int(current_user.prestador_id or 0)
    if cirurgiao_padrao_id <= 0 or cirurgiao_padrao_id not in cirurgioes_ids:
        cirurgiao_padrao_id = int(cirurgioes[0]["id"]) if cirurgioes else None

    modelo_pref_id = _resolve_modelo_receita_preferido(current_user)
    modelos_ids = {int(item["id"]) for item in modelos}
    if modelo_pref_id not in modelos_ids:
        modelo_pref_id = int(modelos[0]["id"]) if modelos else None

    return {
        "cirurgioes": cirurgioes,
        "cirurgiao_padrao_id": cirurgiao_padrao_id,
        "modelos_receituario": modelos,
        "modelo_padrao_id": modelo_pref_id,
        "paciente": paciente,
        "tipos_uso": tipos_uso,
        "medicamentos": medicamentos,
        "medicamentos_fonte": medicamentos_fonte,
    }


@router.get("/assistente-receitas/medicamentos")
def listar_medicamentos_assistente_receitas(
    q: str = Query(default=""),
    limit: int = Query(default=250, ge=1, le=1000),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    itens, fonte = _listar_medicamentos_contexto(db, current_user, q=q, limit=int(limit or 250))
    return {"itens": itens, "fonte": fonte}


@router.get("/assistente-atestado/contexto")
def obter_contexto_assistente_atestado(
    paciente_id: int | None = Query(default=None),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cirurgioes = _listar_cirurgioes_contexto(db, current_user)
    modelos = _listar_modelos_atestado_contexto(db, current_user)
    motivos = _listar_motivos_atestado_contexto(db, current_user)
    paciente = _carregar_paciente_contexto(db, current_user, paciente_id)

    cirurgioes_ids = {int(item["id"]) for item in cirurgioes}
    cirurgiao_padrao_id = int(current_user.prestador_id or 0)
    if cirurgiao_padrao_id <= 0 or cirurgiao_padrao_id not in cirurgioes_ids:
        cirurgiao_padrao_id = int(cirurgioes[0]["id"]) if cirurgioes else None

    modelo_pref_id = _resolve_modelo_atestado_preferido(current_user)
    modelos_ids = {int(item["id"]) for item in modelos}
    if modelo_pref_id not in modelos_ids:
        modelo_pref_id = int(modelos[0]["id"]) if modelos else None

    return {
        "cirurgioes": cirurgioes,
        "cirurgiao_padrao_id": cirurgiao_padrao_id,
        "modelos_atestado": modelos,
        "modelo_padrao_id": modelo_pref_id,
        "paciente": paciente,
        "motivos_atestado": motivos,
        "data_inicial_padrao": datetime.now().strftime("%d/%m/%Y"),
    }


@router.get("/assistente-atestado/motivos")
def listar_motivos_assistente_atestado(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return {"itens": _listar_motivos_atestado_contexto(db, current_user)}


@router.get("/assistente-atestado/cid")
def listar_cid_assistente_atestado(
    q: str = Query(default=""),
    letra: str = Query(default=""),
    apenas_preferidos: bool = Query(default=False),
    limit: int = Query(default=250, ge=1, le=1000),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    itens = _listar_cid_atestado_contexto(
        db,
        current_user,
        q=q,
        letra=letra,
        apenas_preferidos=bool(apenas_preferidos),
        limit=int(limit or 250),
    )
    return {
        "itens": itens,
        "filtros": {
            "q": str(q or ""),
            "letra": str(letra or "").upper(),
            "apenas_preferidos": bool(apenas_preferidos),
            "limit": int(limit or 250),
        },
    }


@router.get("/modelos")
def listar_modelos_editor_textos(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = _query_visible_models(db, current_user)
    return {"itens": [_serialize_item(item) for item in items]}


@router.get("/modelos/{modelo_id}")
def detalhar_modelo_editor_textos(
    modelo_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.id == int(modelo_id),
            ModeloDocumento.ativo.is_(True),
            or_(
                ModeloDocumento.clinica_id == int(current_user.clinica_id),
                ModeloDocumento.clinica_id.is_(None),
            ),
        )
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Modelo nao encontrado.")
    ext = str(item.extensao or "").strip().lower()
    if ext not in EDITOR_CATALOG_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Formato não pertence ao catálogo do Editor de Textos.")
    abs_path, resolution_source = _resolve_editor_catalog_file(item)
    if resolution_source == "invalid_or_unresolved_registered_path":
        return _catalog_diagnostic_response(
            item,
            extension=ext,
            path=None,
            reason="O caminho registrado não pôde ser validado dentro do armazenamento autorizado do modelo.",
            detected_format="unsafe_or_unresolved_path",
        )
    _editor_textos_load_log("BACKEND EDITOR CATALOG OPEN", {
        "id": int(item.id or 0),
        "extensao": ext,
        "existe": bool(abs_path and abs_path.is_file()),
        "resolutionSource": resolution_source,
        "diagnosticReadOnly": ext not in TEXT_EXTENSIONS,
    })
    return _load_catalog_model_detail(item, ext, abs_path)


@router.post("/modelos")
def criar_modelo_editor_textos(
    payload: ModeloTextoSalvarPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do modelo.")
    tipo_modelo = _normalize_tipo_modelo(payload.tipo_modelo)
    conflito = _find_display_name_conflict(
        db,
        int(current_user.clinica_id),
        tipo_modelo,
        nome,
    )
    if conflito:
        raise HTTPException(status_code=409, detail="Ja existe um modelo com este nome nesta categoria.")
    ext = _normalize_extensao(payload.extensao, ".txt")
    base_filename = f"{_sanitize_filename(nome)}{ext}"
    final_filename = _next_available_filename(db, int(current_user.clinica_id), tipo_modelo, base_filename)
    rel_path, abs_path = _build_clinic_model_path(int(current_user.clinica_id), tipo_modelo, final_filename)

    content = str(payload.conteudo or "")
    content_format = _normalize_content_format(payload.conteudo_formato)
    if ext in RTF_RICH_EXTENSIONS:
        if content_format == "html":
            abs_path.write_text(_html_to_rtf(content), encoding="utf-8")
        else:
            abs_path.write_text(_text_to_rtf(content), encoding="utf-8")
    else:
        if content_format == "html":
            content = _html_to_text(content)
        abs_path.write_text(content, encoding="utf-8")
    _save_editor_meta(
        abs_path,
        conteudo_html=(str(payload.conteudo or "") if content_format == "html" else ""),
        conteudo_formato=content_format,
        pagina_config=payload.pagina_config,
    )

    item = ModeloDocumento(
        clinica_id=int(current_user.clinica_id),
        tipo_modelo=tipo_modelo,
        codigo=f"{tipo_modelo}:{Path(final_filename).stem}".lower()[:80],
        nome_exibicao=nome[:180],
        nome_arquivo=final_filename,
        extensao=ext,
        caminho_arquivo=rel_path,
        ativo=True,
        padrao_clinica=False,
        origem="clinica",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    response = _serialize_item(item)
    loaded = _load_content_bundle(item)
    response["conteudo"] = loaded["text"]
    response["conteudo_html"] = loaded["html"]
    response["conteudo_formato"] = loaded["format"]
    response["pagina_config"] = loaded.get("pagina_config")
    return response


@router.post("/modelos/save-as")
def salvar_como_modelo_editor_textos(
    payload: ModeloTextoSaveAsPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new Oasis model, or explicitly replace a same-name clinic model."""
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do modelo.")

    if payload.replace_model_id is None:
        conflicts = (
            db.query(ModeloDocumento)
            .filter(
                or_(ModeloDocumento.clinica_id == int(current_user.clinica_id), ModeloDocumento.clinica_id.is_(None)),
                ModeloDocumento.ativo.is_(True),
                func.lower(func.trim(ModeloDocumento.nome_exibicao)) == nome.lower(),
            )
            .order_by(ModeloDocumento.clinica_id.is_(None), ModeloDocumento.id.asc())
            .all()
        )
        if conflicts:
            raise HTTPException(
                status_code=409,
                detail={"code": "MODEL_NAME_COLLISION", "models": [_serialize_item(item) for item in conflicts]},
            )
        return criar_modelo_editor_textos(payload, current_user, db)

    target = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.id == int(payload.replace_model_id),
            ModeloDocumento.ativo.is_(True),
            ModeloDocumento.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not target:
        raise HTTPException(status_code=409, detail="Somente um modelo ativo da clínica pode ser substituído; escolha outro nome.")
    if str(target.nome_exibicao or "").strip().lower() != nome.lower():
        raise HTTPException(status_code=409, detail="O modelo escolhido não corresponde ao nome em colisão.")

    replacement = ModeloTextoSalvarPayload(
        nome=str(target.nome_exibicao or "").strip(),
        conteudo=payload.conteudo,
        conteudo_formato=payload.conteudo_formato,
        tipo_modelo=str(target.tipo_modelo or "outros"),
        extensao=".txt",
        pagina_config=payload.pagina_config,
    )
    return salvar_modelo_editor_textos(int(target.id), replacement, current_user, db)


@router.put("/modelos/{modelo_id}")
def salvar_modelo_editor_textos(
    modelo_id: int,
    payload: ModeloTextoSalvarPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    source = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.id == int(modelo_id),
            ModeloDocumento.ativo.is_(True),
            or_(
                ModeloDocumento.clinica_id == int(current_user.clinica_id),
                ModeloDocumento.clinica_id.is_(None),
            ),
        )
        .first()
    )
    if not source:
        raise HTTPException(status_code=404, detail="Modelo nao encontrado.")

    editable = _ensure_editable_item(db, current_user, source)
    nome = str(payload.nome or editable.nome_exibicao or "").strip()
    if nome:
        nome_atual = str(editable.nome_exibicao or "").strip()
        if nome.lower() != nome_atual.lower():
            conflito = _find_display_name_conflict(
                db,
                int(current_user.clinica_id),
                str(editable.tipo_modelo or "outros"),
                nome,
                exclude_id=int(editable.id or 0),
            )
            if conflito:
                raise HTTPException(status_code=409, detail="Ja existe um modelo com este nome nesta categoria.")
        editable.nome_exibicao = nome[:180]
    ext = _normalize_extensao(payload.extensao, str(editable.extensao or ".txt"))
    if ext != str(editable.extensao or "").lower():
        stem = Path(str(editable.nome_arquivo or "modelo")).stem
        candidate = _next_available_storage_filename(
            db,
            int(current_user.clinica_id),
            str(editable.tipo_modelo or "outros"),
            f"{stem}{ext}",
            exclude_id=int(editable.id or 0),
        )
        editable.extensao = ext
        editable.nome_arquivo = candidate
        rel, _ = _build_clinic_model_path(int(current_user.clinica_id), str(editable.tipo_modelo or "outros"), str(editable.nome_arquivo))
        editable.caminho_arquivo = rel

    rel_path, abs_path = _build_clinic_model_path(
        int(current_user.clinica_id),
        str(editable.tipo_modelo or "outros"),
        str(editable.nome_arquivo or "novo.txt"),
    )
    editable.caminho_arquivo = rel_path

    content = str(payload.conteudo or "")
    content_format = _normalize_content_format(payload.conteudo_formato)
    if str(editable.extensao or "").lower() in RTF_RICH_EXTENSIONS:
        if content_format == "html":
            abs_path.write_text(_html_to_rtf(content), encoding="utf-8")
        else:
            abs_path.write_text(_text_to_rtf(content), encoding="utf-8")
    else:
        if content_format == "html":
            content = _html_to_text(content)
        abs_path.write_text(content, encoding="utf-8")
    _save_editor_meta(
        abs_path,
        conteudo_html=(str(payload.conteudo or "") if content_format == "html" else ""),
        conteudo_formato=content_format,
        pagina_config=payload.pagina_config,
    )

    db.add(editable)
    db.commit()
    db.refresh(editable)
    response = _serialize_item(editable)
    loaded = _load_content_bundle(editable)
    response["conteudo"] = loaded["text"]
    response["conteudo_html"] = loaded["html"]
    response["conteudo_formato"] = loaded["format"]
    response["pagina_config"] = loaded.get("pagina_config")
    return response


@router.post("/exportar-pdf")
def exportar_pdf_editor_textos(
    payload: ExportarPdfPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    nome_documento = str(payload.document_name or "").strip() or "Documento"
    origem = str(payload.origem or "editor_textos").strip() or "editor_textos"
    try:
        pdf_bytes, filename = _generate_editor_pdf_document(
            conteudo=str(payload.conteudo or ""),
            conteudo_formato=str(payload.conteudo_formato or "text"),
            pagina_config=payload.pagina_config,
            page_snapshot_data_url=payload.page_snapshot_data_url,
            page_snapshot_html=payload.page_snapshot_html,
            document_name=nome_documento,
            strip_signature_placeholders=bool(payload.strip_signature_tokens),
        )
        if bool(payload.add_signature_field):
            pdf_bytes = append_empty_signature_field_to_pdf(
                pdf_bytes,
                field_name=str(payload.signature_field_name or "Assinatura").strip() or "Assinatura",
                signature_box_hint=payload.signature_box_hint if isinstance(payload.signature_box_hint, dict) else None,
            )
    except (EditorPdfRenderError, DigitalSignatureError) as exc:
        _registrar_auditoria_editor_pdf(
            db,
            current_user,
            acao="editor_textos.exportar_pdf_falha",
            detalhes=_pdf_audit_details(
                document_name=nome_documento,
                origem=origem,
                paciente_id=payload.paciente_id,
                cirurgiao_id=payload.cirurgiao_id,
                modelo_id=payload.modelo_id,
                status="erro",
                detalhe=str(exc),
            ),
        )
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    _registrar_auditoria_editor_pdf(
        db,
        current_user,
        acao="editor_textos.exportar_pdf",
        detalhes=_pdf_audit_details(
            document_name=nome_documento,
            origem=origem,
            paciente_id=payload.paciente_id,
            cirurgiao_id=payload.cirurgiao_id,
            modelo_id=payload.modelo_id,
            arquivo_pdf=filename,
            status="ok",
        ),
    )
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "X-Generated-Filename": filename,
    }
    if bool(payload.add_signature_field):
        headers["X-Pdf-Field-Name"] = str(payload.signature_field_name or "Assinatura").strip() or "Assinatura"
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)


@router.post("/assistente-receitas/exportar-pdf-template")
def exportar_pdf_template_assistente_receitas(
    payload: ExportarReceitaTemplatePayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    corpo = str(payload.corpo_receita or "").strip()
    if not corpo:
        raise HTTPException(status_code=400, detail="Corpo da receita vazio.")
    paciente_id = int(payload.paciente_id or 0)
    if paciente_id <= 0:
        raise HTTPException(status_code=400, detail="Paciente invalido para o receituario.")
    cirurgiao_id = int(payload.cirurgiao_id or 0) or None
    nome_documento = str(payload.document_name or "").strip() or "Receituario"
    origem = str(payload.origem or "editor_textos_receita_template").strip() or "editor_textos_receita_template"

    values = _build_merge_values(
        db=db,
        current_user=current_user,
        paciente_id=paciente_id,
        cirurgiao_id=cirurgiao_id,
        extras={"Receita.Corpo": corpo},
    )
    paciente_endereco, paciente_cidade_estado = _paciente_endereco_linhas(values)
    clinica_endereco, clinica_cidade_estado = _clinica_rodape_linhas(values)
    try:
        pdf_bytes = generate_receituario_acroform_pdf_bytes(
            clinica_nome=str(values.get(_norm_merge_key("Clinica.Nome")) or "").strip(),
            clinica_endereco=clinica_endereco,
            clinica_cidade_estado=clinica_cidade_estado,
            clinica_telefones=str(values.get(_norm_merge_key("Clinica.Telefones")) or "").strip(),
            paciente_nome=str(values.get(_norm_merge_key("Paciente.NomeCompleto")) or "").strip(),
            paciente_endereco=paciente_endereco,
            paciente_cidade_estado=paciente_cidade_estado,
            paciente_data_nascimento=str(values.get(_norm_merge_key("Paciente.DataNasc")) or "").strip(),
            paciente_idade=str(values.get(_norm_merge_key("Paciente.Idade")) or "").strip(),
            corpo_receita=corpo,
            data_emissao=str(values.get(_norm_merge_key("Data.DataHoje")) or "").strip(),
            titulo=nome_documento,
            field_name="Assinatura",
        )
    except ReceituarioPdfTemplateError as exc:
        _registrar_auditoria_editor_pdf(
            db,
            current_user,
            acao="editor_textos.exportar_pdf_template_receita_falha",
            detalhes=_pdf_audit_details(
                document_name=nome_documento,
                origem=origem,
                paciente_id=paciente_id,
                cirurgiao_id=cirurgiao_id,
                modelo_id=payload.modelo_id,
                status="erro",
                detalhe=str(exc),
            ),
        )
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    filename = _build_pdf_export_filename(nome_documento)
    _registrar_auditoria_editor_pdf(
        db,
        current_user,
        acao="editor_textos.exportar_pdf_template_receita",
        detalhes=_pdf_audit_details(
            document_name=nome_documento,
            origem=origem,
            paciente_id=paciente_id,
            cirurgiao_id=cirurgiao_id,
            modelo_id=payload.modelo_id,
            arquivo_pdf=filename,
            status="ok",
        ),
    )
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "X-Generated-Filename": filename,
        "X-Pdf-Field-Name": "Assinatura",
        "X-Pdf-Sign-Existing-Field": "1",
        "X-Pdf-Sign-Profile": "acrobat_compat",
    }
    return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)


def _sign_pdf_with_optional_anchor(
    *,
    pdf_bytes: bytes,
    pfx_bytes: bytes,
    pfx_password: str,
    field_name: str,
    signature_box_hint: dict | None,
    use_existing_field: bool,
    signature_profile: str,
    prepare_signature_anchor_requested: bool,
) -> bytes:
    if not prepare_signature_anchor_requested:
        return sign_pdf_a1_invisible(
            pdf_bytes=pdf_bytes,
            pfx_bytes=pfx_bytes,
            pfx_password=pfx_password,
            field_name=field_name,
            signature_box_hint=signature_box_hint,
            use_existing_field=use_existing_field,
            signature_profile=signature_profile,
        )

    def sign_existing_field(
        prepared_pdf_bytes: bytes,
        *,
        field_name: str,
        use_existing_field: bool,
    ) -> bytes:
        return sign_pdf_a1_invisible(
            pdf_bytes=prepared_pdf_bytes,
            pfx_bytes=pfx_bytes,
            pfx_password=pfx_password,
            field_name=field_name,
            signature_box_hint=None,
            use_existing_field=use_existing_field,
            signature_profile=signature_profile,
        )

    result = prepare_and_invoke_signer(
        pdf_bytes,
        sign_existing_field,
        field_name="BranaSignature_1",
    )
    return result.signer_result


def _build_prepared_signature_filename(document_name: str | None) -> str:
    raw_name = str(document_name or "").strip()
    if any(character in raw_name for character in ("\r", "\n", "/", "\\", '"')):
        raw_name = "documento"
    source_name = _build_pdf_export_filename(raw_name)
    stem = Path(source_name).stem or "documento"
    return f"{stem}-signature-prepared.pdf"


@router.post("/preparar-pdf-assinatura-local")
async def preparar_pdf_assinatura_local_editor_textos(
    pdf_file: UploadFile = File(...),
    document_name: str = Form(default=""),
    current_user: Usuario = Depends(get_current_user),
):
    _ = current_user
    try:
        pdf_bytes = await pdf_file.read(SIGNATURE_ANCHOR_MAX_PDF_BYTES + 1)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="PDF_UPLOAD_READ_FAILED") from exc
    finally:
        await pdf_file.close()
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="PDF_EMPTY")
    if len(pdf_bytes) > SIGNATURE_ANCHOR_MAX_PDF_BYTES:
        raise HTTPException(status_code=400, detail="PDF_TOO_LARGE")
    try:
        prepared = await run_in_threadpool(
            prepare_signature_anchor,
            pdf_bytes,
            field_name=SIGNATURE_ANCHOR_FIELD_NAME,
        )
    except SignatureAnchorError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    filename_hint = str(document_name or "").strip() or str(getattr(pdf_file, "filename", "") or "").strip()
    filename = _build_prepared_signature_filename(filename_hint)
    exposed_headers = (
        "Content-Disposition, X-Prepared-Pdf-SHA256, X-Pdf-Field-Name, "
        "X-Pdf-Field-Page, X-Pdf-Field-Rect, X-Preparation-Contract"
    )
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "X-Prepared-Pdf-SHA256": prepared.sha256,
        "X-Pdf-Field-Name": prepared.field_name,
        "X-Pdf-Field-Page": str(prepared.page_index),
        "X-Pdf-Field-Rect": json.dumps(list(prepared.signature_rect), separators=(",", ":")),
        "X-Preparation-Contract": "brana-signature-prepared-v1",
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": exposed_headers,
    }
    return Response(content=prepared.pdf_bytes, media_type="application/pdf", headers=headers)


@router.post("/assinar-pdf")
async def assinar_pdf_editor_textos(
    pdf_file: UploadFile | None = File(default=None),
    conteudo_file: UploadFile | None = File(default=None),
    pfx_file: UploadFile = File(...),
    pfx_password: str = Form(default=""),
    field_name: str = Form(default="Signature1"),
    signature_box_hint_json: str = Form(default=""),
    use_existing_field: bool = Form(default=False),
    prepare_signature_anchor: bool = Form(default=False),
    signature_profile: str = Form(default="pades"),
    use_editor_content: bool = Form(default=False),
    conteudo: str = Form(default=""),
    conteudo_formato: str = Form(default="text"),
    pagina_config_json: str = Form(default=""),
    document_name: str = Form(default=""),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ = current_user

    pdf_name = str(getattr(pdf_file, "filename", "") or "").strip()
    pfx_name = str(getattr(pfx_file, "filename", "") or "").strip()

    if not (pfx_name.lower().endswith(".pfx") or pfx_name.lower().endswith(".p12")):
        raise HTTPException(status_code=400, detail="Selecione um certificado digital PFX/P12 valido.")

    pdf_bytes = b""
    audit_origem = "editor_textos_assinatura"
    audit_document_name = str(document_name or "").strip() or "Documento"
    audit_paciente_id: int | None = None
    audit_cirurgiao_id: int | None = None
    audit_modelo_id: int | None = None
    signature_box_hint = None
    raw_hint = str(signature_box_hint_json or "").strip()
    if raw_hint:
        try:
            signature_box_hint = json.loads(raw_hint)
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Posicionamento da assinatura invalido.") from exc
    if bool(use_editor_content):
        pagina_config = {}
        raw_cfg = str(pagina_config_json or "").strip()
        if raw_cfg:
            try:
                pagina_config = json.loads(raw_cfg)
            except Exception as exc:
                raise HTTPException(status_code=400, detail="Configuracao de pagina invalida.") from exc
        conteudo_render = str(conteudo or "")
        if conteudo_file is not None:
            try:
                conteudo_render = (await conteudo_file.read()).decode("utf-8")
            except Exception as exc:
                raise HTTPException(status_code=400, detail="Conteudo do editor invalido.") from exc
        try:
            pdf_bytes, pdf_name = _generate_editor_pdf_document(
                conteudo=conteudo_render,
                conteudo_formato=str(conteudo_formato or "text"),
                pagina_config=pagina_config,
                document_name=audit_document_name,
                strip_signature_placeholders=not bool(prepare_signature_anchor),
            )
        except EditorPdfRenderError as exc:
            _registrar_auditoria_editor_pdf(
                db,
                current_user,
                acao="editor_textos.assinar_pdf_falha",
                detalhes=_pdf_audit_details(
                    document_name=audit_document_name,
                    origem=audit_origem,
                    status="erro",
                    detalhe=str(exc),
                ),
            )
            raise HTTPException(status_code=400, detail=str(exc)) from exc
    else:
        if not pdf_file or not pdf_name.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Selecione um arquivo PDF valido.")
        pdf_bytes = await pdf_file.read()
        audit_document_name = Path(pdf_name).stem or audit_document_name

    pfx_bytes = await pfx_file.read()

    _registrar_auditoria_editor_pdf(
        db,
        current_user,
        acao="editor_textos.assinar_pdf_solicitado",
        detalhes=_pdf_audit_details(
            document_name=audit_document_name,
            origem=audit_origem,
            paciente_id=audit_paciente_id,
            cirurgiao_id=audit_cirurgiao_id,
            modelo_id=audit_modelo_id,
            arquivo_pdf=_build_pdf_export_filename(pdf_name or audit_document_name),
            status="solicitado",
        ),
    )

    try:
        signed_pdf = await run_in_threadpool(
            _sign_pdf_with_optional_anchor,
            pdf_bytes=pdf_bytes,
            pfx_bytes=pfx_bytes,
            pfx_password=str(pfx_password or ""),
            field_name=str(field_name or "Signature1"),
            signature_box_hint=signature_box_hint,
            use_existing_field=bool(use_existing_field),
            signature_profile=str(signature_profile or "pades"),
            prepare_signature_anchor_requested=bool(prepare_signature_anchor),
        )
    except (DigitalSignatureError, SignatureWorkflowError) as exc:
        _registrar_auditoria_editor_pdf(
            db,
            current_user,
            acao="editor_textos.assinar_pdf_falha",
            detalhes=_pdf_audit_details(
                document_name=audit_document_name,
                origem=audit_origem,
                paciente_id=audit_paciente_id,
                cirurgiao_id=audit_cirurgiao_id,
                modelo_id=audit_modelo_id,
                arquivo_pdf=_build_pdf_export_filename(pdf_name or audit_document_name),
                status="erro",
                detalhe=str(exc),
            ),
        )
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    filename = build_signed_filename(pdf_name)
    _registrar_auditoria_editor_pdf(
        db,
        current_user,
        acao="editor_textos.assinar_pdf_concluido",
        detalhes=_pdf_audit_details(
            document_name=audit_document_name,
            origem=audit_origem,
            paciente_id=audit_paciente_id,
            cirurgiao_id=audit_cirurgiao_id,
            modelo_id=audit_modelo_id,
            arquivo_pdf=filename,
            status="ok",
        ),
    )
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "X-Signed-Filename": filename,
    }
    return Response(content=signed_pdf, media_type="application/pdf", headers=headers)


@router.post("/registrar-assinatura-local")
def registrar_assinatura_local_editor_textos(
    payload: RegistrarAssinaturaLocalPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    status = str(payload.status or "solicitado").strip().lower() or "solicitado"
    acao = {
        "solicitado": "editor_textos.assinar_pdf_windows_store_solicitado",
        "ok": "editor_textos.assinar_pdf_windows_store_concluido",
        "erro": "editor_textos.assinar_pdf_windows_store_falha",
    }.get(status, "editor_textos.assinar_pdf_windows_store_evento")
    _registrar_auditoria_editor_pdf(
        db,
        current_user,
        acao=acao,
        detalhes=_pdf_audit_details(
            document_name=str(payload.document_name or "").strip() or "Documento",
            origem=str(payload.origem or "editor_textos_assinatura_local").strip() or "editor_textos_assinatura_local",
            paciente_id=payload.paciente_id,
            cirurgiao_id=payload.cirurgiao_id,
            modelo_id=payload.modelo_id,
            arquivo_pdf=str(payload.arquivo_pdf or "").strip() or None,
            status=status,
            detalhe=str(payload.detalhe or "").strip() or None,
            thumbprint=str(payload.thumbprint or "").strip().upper() or None,
        ),
    )
    return {"ok": True}


@router.post("/preparar-pdf-acrobat", response_model=AbrirPdfAppResponse)
async def preparar_pdf_acrobat_editor_textos(
    pdf_file: UploadFile = File(...),
    document_name: str = Form(default=""),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    filename_hint = str(document_name or "").strip() or str(pdf_file.filename or "").strip() or "Documento"
    try:
        pdf_bytes = await pdf_file.read()
        caminho = await run_in_threadpool(_salvar_pdf_temp_local, pdf_bytes, filename_hint)
    except EditorPdfRenderError as exc:
        _registrar_auditoria_editor_pdf(
            db,
            current_user,
            acao=AUDIT_ACAO_PREPARAR_PDF_APP_FALHA,
            detalhes=_pdf_audit_details(
                document_name=filename_hint,
                origem=AUDIT_ORIGEM_PREPARAR_PDF_APP,
                status="erro",
                detalhe=str(exc),
                acao_legado=AUDIT_ACAO_PREPARAR_PDF_APP_FALHA_LEGACY,
                origem_legado=AUDIT_ORIGEM_PREPARAR_PDF_APP_LEGACY,
            ),
        )
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        _registrar_auditoria_editor_pdf(
            db,
            current_user,
            acao=AUDIT_ACAO_PREPARAR_PDF_APP_FALHA,
            detalhes=_pdf_audit_details(
                document_name=filename_hint,
                origem=AUDIT_ORIGEM_PREPARAR_PDF_APP,
                status="erro",
                detalhe=str(exc),
                acao_legado=AUDIT_ACAO_PREPARAR_PDF_APP_FALHA_LEGACY,
                origem_legado=AUDIT_ORIGEM_PREPARAR_PDF_APP_LEGACY,
            ),
        )
        raise HTTPException(status_code=500, detail="Falha ao preparar PDF para abertura no aplicativo de PDF.") from exc

    _registrar_auditoria_editor_pdf(
        db,
        current_user,
        acao=AUDIT_ACAO_PREPARAR_PDF_APP,
        detalhes=_pdf_audit_details(
            document_name=filename_hint,
            origem=AUDIT_ORIGEM_PREPARAR_PDF_APP,
            status="ok",
            arquivo_pdf=Path(caminho).name,
            acao_legado=AUDIT_ACAO_PREPARAR_PDF_APP_LEGACY,
            origem_legado=AUDIT_ORIGEM_PREPARAR_PDF_APP_LEGACY,
        ),
    )
    return AbrirPdfAppResponse(opened=False, file_path=caminho)


@router.post("/abrir-no-acrobat", response_model=AbrirPdfAppResponse)
async def abrir_no_acrobat_editor_textos(
    pdf_file: UploadFile = File(...),
    document_name: str = Form(default=""),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    filename_hint = str(document_name or "").strip() or str(pdf_file.filename or "").strip() or "Documento"
    try:
        pdf_bytes = await pdf_file.read()
        caminho = await run_in_threadpool(_abrir_pdf_no_app_local, pdf_bytes, filename_hint)
    except EditorPdfRenderError as exc:
        _registrar_auditoria_editor_pdf(
            db,
            current_user,
            acao=AUDIT_ACAO_ABRIR_PDF_APP_FALHA,
            detalhes=_pdf_audit_details(
                document_name=filename_hint,
                origem=AUDIT_ORIGEM_ABRIR_PDF_APP,
                status="erro",
                detalhe=str(exc),
                acao_legado=AUDIT_ACAO_ABRIR_PDF_APP_FALHA_LEGACY,
                origem_legado=AUDIT_ORIGEM_ABRIR_PDF_APP_LEGACY,
            ),
        )
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        _registrar_auditoria_editor_pdf(
            db,
            current_user,
            acao=AUDIT_ACAO_ABRIR_PDF_APP_FALHA,
            detalhes=_pdf_audit_details(
                document_name=filename_hint,
                origem=AUDIT_ORIGEM_ABRIR_PDF_APP,
                status="erro",
                detalhe=str(exc),
                acao_legado=AUDIT_ACAO_ABRIR_PDF_APP_FALHA_LEGACY,
                origem_legado=AUDIT_ORIGEM_ABRIR_PDF_APP_LEGACY,
            ),
        )
        raise HTTPException(status_code=500, detail="Falha ao abrir PDF no aplicativo de PDF.") from exc

    _registrar_auditoria_editor_pdf(
        db,
        current_user,
        acao=AUDIT_ACAO_ABRIR_PDF_APP,
        detalhes=_pdf_audit_details(
            document_name=filename_hint,
            origem=AUDIT_ORIGEM_ABRIR_PDF_APP,
            status="ok",
            arquivo_pdf=Path(caminho).name,
            acao_legado=AUDIT_ACAO_ABRIR_PDF_APP_LEGACY,
            origem_legado=AUDIT_ORIGEM_ABRIR_PDF_APP_LEGACY,
        ),
    )
    return AbrirPdfAppResponse(file_path=caminho)


@router.post("/abrir-arquivo-pdf-acrobat", response_model=AbrirPdfAppResponse)
async def abrir_arquivo_pdf_acrobat_editor_textos(
    payload: AbrirPdfAppPathPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    file_path = str(payload.file_path or "").strip()
    filename_hint = Path(file_path).name or "Documento.pdf"
    try:
        caminho = await run_in_threadpool(_abrir_pdf_path_no_app_local, file_path)
    except EditorPdfRenderError as exc:
        _registrar_auditoria_editor_pdf(
            db,
            current_user,
            acao=AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP_FALHA,
            detalhes=_pdf_audit_details(
                document_name=filename_hint,
                origem=AUDIT_ORIGEM_ABRIR_PDF_PREPARADO_APP,
                status="erro",
                detalhe=str(exc),
                arquivo_pdf=filename_hint,
                acao_legado=AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP_FALHA_LEGACY,
                origem_legado=AUDIT_ORIGEM_ABRIR_PDF_PREPARADO_APP_LEGACY,
            ),
        )
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        _registrar_auditoria_editor_pdf(
            db,
            current_user,
            acao=AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP_FALHA,
            detalhes=_pdf_audit_details(
                document_name=filename_hint,
                origem=AUDIT_ORIGEM_ABRIR_PDF_PREPARADO_APP,
                status="erro",
                detalhe=str(exc),
                arquivo_pdf=filename_hint,
                acao_legado=AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP_FALHA_LEGACY,
                origem_legado=AUDIT_ORIGEM_ABRIR_PDF_PREPARADO_APP_LEGACY,
            ),
        )
        raise HTTPException(status_code=500, detail="Falha ao abrir PDF preparado no aplicativo de PDF.") from exc

    _registrar_auditoria_editor_pdf(
        db,
        current_user,
        acao=AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP,
        detalhes=_pdf_audit_details(
            document_name=filename_hint,
            origem=AUDIT_ORIGEM_ABRIR_PDF_PREPARADO_APP,
            status="ok",
            arquivo_pdf=Path(caminho).name,
            acao_legado=AUDIT_ACAO_ABRIR_PDF_PREPARADO_APP_LEGACY,
            origem_legado=AUDIT_ORIGEM_ABRIR_PDF_PREPARADO_APP_LEGACY,
        ),
    )
    return AbrirPdfAppResponse(file_path=caminho)


@router.patch("/modelos/{modelo_id}/renomear")
def renomear_modelo_editor_textos(
    modelo_id: int,
    payload: ModeloTextoRenomearPayload,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.id == int(modelo_id),
            ModeloDocumento.ativo.is_(True),
            ModeloDocumento.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not item:
        maybe_base = (
            db.query(ModeloDocumento.id)
            .filter(
                ModeloDocumento.id == int(modelo_id),
                ModeloDocumento.ativo.is_(True),
                ModeloDocumento.clinica_id.is_(None),
            )
            .first()
        )
        if maybe_base:
            raise HTTPException(status_code=403, detail="Modelos de sistema nao podem ser renomeados.")
        raise HTTPException(status_code=404, detail="Modelo nao encontrado.")
    nome = str(payload.nome or "").strip()
    if not nome:
        raise HTTPException(status_code=400, detail="Informe o nome do modelo.")
    conflito = _find_display_name_conflict(
        db,
        int(current_user.clinica_id),
        str(item.tipo_modelo or "outros"),
        nome,
        exclude_id=int(item.id or 0),
    )
    if conflito:
        raise HTTPException(status_code=409, detail="Ja existe um modelo com este nome nesta categoria.")
    item.nome_exibicao = nome[:180]
    db.add(item)
    db.commit()
    db.refresh(item)
    return _serialize_item(item)


@router.delete("/modelos/{modelo_id}")
def excluir_modelo_editor_textos(
    modelo_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(ModeloDocumento)
        .filter(
            ModeloDocumento.id == int(modelo_id),
            ModeloDocumento.ativo.is_(True),
            ModeloDocumento.clinica_id == int(current_user.clinica_id),
        )
        .first()
    )
    if not item:
        maybe_base = (
            db.query(ModeloDocumento.id)
            .filter(
                ModeloDocumento.id == int(modelo_id),
                ModeloDocumento.ativo.is_(True),
                ModeloDocumento.clinica_id.is_(None),
            )
            .first()
        )
        if maybe_base:
            raise HTTPException(status_code=403, detail="Modelos de sistema nao podem ser excluidos.")
        raise HTTPException(status_code=404, detail="Modelo nao encontrado.")

    abs_path = _safe_relative_path(str(item.caminho_arquivo or ""))
    meta_path = _build_editor_meta_path(abs_path) if abs_path else None
    item.ativo = False
    db.add(item)
    db.commit()

    try:
        if abs_path and abs_path.exists() and abs_path.is_file():
            abs_path.unlink()
    except Exception:
        pass
    try:
        if meta_path and meta_path.exists() and meta_path.is_file():
            meta_path.unlink()
    except Exception:
        pass

    return {"ok": True, "id": int(modelo_id)}
