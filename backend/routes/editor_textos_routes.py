from pathlib import Path
import json
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
from services.platform_admin_service import registrar_auditoria
from services.receituario_pdf_template_service import (
    ReceituarioPdfTemplateError,
    generate_receituario_acroform_pdf_bytes,
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


class ModeloTextoRenomearPayload(BaseModel):
    nome: str = Field(default="", max_length=180)


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
    _set_merge_value(values, ["Data.MesExt", "Data.MêsExt"], mes_nome)
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
    if raw in {"html", "text"}:
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

    out: list[str] = []
    stack: list[tuple[bool, int, dict, str]] = []
    ignorable = False
    ucskip = 1
    curskip = 0
    state = {"b": False, "i": False, "u": False}
    align = "left"
    para_open = False
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
        nonlocal para_open
        if para_open:
            return
        style = ""
        if align != "left":
            style = f' style="text-align:{align}"'
        out.append(f"<p{style}>")
        para_open = True

    def close_para() -> None:
        nonlocal para_open
        if para_open:
            out.append("</p>")
            para_open = False

    def apply_state(target: dict) -> None:
        nonlocal state
        # fecha primeiro na ordem inversa
        if state["u"] and not target["u"]:
            out.append("</u>")
        if state["i"] and not target["i"]:
            out.append("</em>")
        if state["b"] and not target["b"]:
            out.append("</strong>")
        # abre na ordem fixa
        if not state["b"] and target["b"]:
            out.append("<strong>")
        if not state["i"] and target["i"]:
            out.append("<em>")
        if not state["u"] and target["u"]:
            out.append("<u>")
        state = {"b": bool(target["b"]), "i": bool(target["i"]), "u": bool(target["u"])}

    def break_paragraph() -> None:
        apply_state({"b": False, "i": False, "u": False})
        close_para()
        open_para()

    open_para()
    while idx < len(rtf):
        ch = rtf[idx]
        if ch == "{":
            stack.append((ignorable, ucskip, state.copy(), align))
            idx += 1
            continue
        if ch == "}":
            if stack:
                prev_ignorable, prev_ucskip, prev_state, prev_align = stack.pop()
                if not ignorable:
                    if align != prev_align:
                        apply_state({"b": False, "i": False, "u": False})
                        close_para()
                        align = normalize_align(prev_align)
                        open_para()
                    apply_state(prev_state)
                ignorable, ucskip = prev_ignorable, prev_ucskip
            idx += 1
            continue
        if ch == "\\":
            idx += 1
            if idx >= len(rtf):
                break
            ctrl = rtf[idx]
            if ctrl in "\\{}":
                if not ignorable and curskip <= 0:
                    open_para()
                    out.append(html_escape(ctrl))
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
                        open_para()
                        out.append(html_escape(decoded))
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

                if word in {"par"} and not ignorable:
                    break_paragraph()
                elif word in {"line"} and not ignorable:
                    open_para()
                    out.append("<br>")
                elif word == "tab" and not ignorable:
                    open_para()
                    out.append("&emsp;")
                elif word == "uc" and arg_num is not None:
                    ucskip = max(0, arg_num)
                elif word == "u" and arg_num is not None:
                    if not ignorable:
                        cp = arg_num if arg_num >= 0 else arg_num + 65536
                        open_para()
                        out.append(html_escape(chr(cp)))
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
            open_para()
            out.append(html_escape(ch))
        idx += 1

    apply_state({"b": False, "i": False, "u": False})
    close_para()
    html = "".join(out).strip()
    if not html:
        return "<p></p>"
    return html


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
    altura = max(50.0, _to_float(raw.get("altura_mm", 279.4), 279.4))
    largura = max(50.0, _to_float(raw.get("largura_mm", 215.9), 215.9))
    margem_sup = max(0.0, _to_float(raw.get("margem_superior_mm", 25.4), 25.4))
    margem_esq = max(0.0, _to_float(raw.get("margem_esquerda_mm", 33.16), 33.16))
    margem_dir = max(0.0, _to_float(raw.get("margem_direita_mm", 33.16), 33.16))
    return {
        "tipo_papel": tipo_papel,
        "orientacao": orientacao,
        "altura_mm": round(float(altura), 2),
        "largura_mm": round(float(largura), 2),
        "margem_superior_mm": round(float(margem_sup), 2),
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


def _save_editor_meta(abs_path: Path | None, *, conteudo_html=None, pagina_config=None) -> None:
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
            ModeloDocumento.extensao.in_(tuple(TEXT_EXTENSIONS)),
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
    if ext not in TEXT_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Formato de arquivo nao editavel no editor interno.")
    path_info = _resolve_model_file_info(item)
    abs_path = path_info.get("path") if isinstance(path_info.get("path"), Path) else None
    original_path = path_info.get("original_path") if isinstance(path_info.get("original_path"), Path) else None
    source = str(path_info.get("source") or "none")
    tamanho_arquivo = 0
    try:
        if abs_path and abs_path.exists() and abs_path.is_file():
            tamanho_arquivo = int(abs_path.stat().st_size)
    except Exception:
        tamanho_arquivo = 0
    original_size = int(path_info.get("original_size") or 0)
    fallback_motivo = str(path_info.get("fallback_reason") or "")
    recursive_choice = path_info.get("chosen_recursive_candidate") if isinstance(path_info, dict) else None
    fallback_usado = source in {"registered_alias", "recursive", "base"}

    if source == "recursive" and isinstance(recursive_choice, dict):
        _editor_textos_load_log("BACKEND MODELO FALLBACK RECURSIVO USADO", {
            "id": int(item.id or 0),
            "nome": str(item.nome_exibicao or "").strip(),
            "caminho_original": str(item.caminho_arquivo or ""),
            "candidato_escolhido": str(recursive_choice.get("path") or ""),
            "extensao": str(recursive_choice.get("ext") or ""),
            "tamanho": int(recursive_choice.get("size") or 0),
        })
    elif source == "base":
        fallback_base = _find_base_fallback_item(db, item)
        _editor_textos_load_log("BACKEND MODELO FALLBACK BASE USADO", {
            "id_original": int(item.id or 0),
            "nome_original": str(item.nome_exibicao or "").strip(),
            "caminho_original": str(item.caminho_arquivo or ""),
            "caminho_original_resolvido": str(original_path or ""),
            "tamanho_original": original_size,
            "motivo": fallback_motivo,
            "id_base": int(fallback_base.id or 0) if fallback_base else None,
            "caminho_base": str(abs_path or ""),
            "tamanho_base": tamanho_arquivo,
        })
    elif source == "none" or not abs_path or not abs_path.exists() or not abs_path.is_file() or tamanho_arquivo <= 0:
        logger.warning("%s %s", "[BACKEND MODELO SEM CONTEUDO]", json.dumps({
            "id": int(item.id or 0),
            "nome": str(item.nome_exibicao or "").strip(),
            "caminho_resolvido": str(abs_path or ""),
            "existe": bool(abs_path and abs_path.exists() and abs_path.is_file()),
            "tamanho": tamanho_arquivo,
        }, ensure_ascii=False, default=str))
    _editor_textos_load_log("BACKEND EDITOR LOAD REQUEST", {
        "id": int(item.id or 0),
        "nome": str(item.nome_exibicao or "").strip(),
        "nomeArquivo": str(item.nome_arquivo or "").strip(),
        "tipoModelo": str(item.tipo_modelo or "").strip(),
        "caminhoSolicitado": str(item.caminho_arquivo or ""),
        "caminhoOriginalResolvido": str(original_path or ""),
        "tamanhoOriginal": original_size,
        "caminhoResolvido": str(abs_path or ""),
        "existe": bool(abs_path and abs_path.exists() and abs_path.is_file()),
        "tamanhoArquivo": tamanho_arquivo,
        "resolutionSource": source,
        "fallbackBaseUsado": fallback_usado,
        "fallbackMotivo": fallback_motivo,
        "storageBase": str(MODEL_STORAGE_DIR),
        "projectDir": str(PROJECT_DIR),
    })
    content = _load_content_bundle_from_path(abs_path)
    response = _serialize_item(item)
    response["conteudo"] = content["text"]
    response["conteudo_html"] = content["html"]
    response["conteudo_formato"] = content["format"]
    response["pagina_config"] = content.get("pagina_config")
    _editor_textos_load_log("BACKEND EDITOR LOAD RESPONSE", {
        "camposRetornados": list(response.keys()),
        "conteudoHtmlLength": len(str(response.get("conteudo_html") or "")),
        "conteudoLength": len(str(response.get("conteudo") or "")),
        "previewConteudoHtml": _editor_textos_debug_preview(str(response.get("conteudo_html") or "")),
        "previewConteudo": _editor_textos_debug_preview(str(response.get("conteudo") or "")),
    })
    return response


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
        editable.extensao = ext
        stem = Path(str(editable.nome_arquivo or "modelo")).stem
        editable.nome_arquivo = f"{stem}{ext}"
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


@router.post("/assinar-pdf")
async def assinar_pdf_editor_textos(
    pdf_file: UploadFile | None = File(default=None),
    conteudo_file: UploadFile | None = File(default=None),
    pfx_file: UploadFile = File(...),
    pfx_password: str = Form(default=""),
    field_name: str = Form(default="Signature1"),
    signature_box_hint_json: str = Form(default=""),
    use_existing_field: bool = Form(default=False),
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
                strip_signature_placeholders=True,
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
            sign_pdf_a1_invisible,
            pdf_bytes=pdf_bytes,
            pfx_bytes=pfx_bytes,
            pfx_password=str(pfx_password or ""),
            field_name=str(field_name or "Signature1"),
            signature_box_hint=signature_box_hint,
            use_existing_field=bool(use_existing_field),
            signature_profile=str(signature_profile or "pades"),
        )
    except DigitalSignatureError as exc:
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
