import io
from datetime import datetime
from pathlib import Path


class ReceituarioPdfTemplateError(Exception):
    """Erro controlado na geração do receituário PDF em AcroForm."""


PROJECT_DIR = Path(__file__).resolve().parents[3]
PDF_TEMPLATE_DIR = PROJECT_DIR / "saas" / "backend" / "data" / "pdf_templates"
DEFAULT_RECEITUARIO_TEMPLATE = PDF_TEMPLATE_DIR / "receituario_simples_brana_digital.pdf"


def _load_pypdf():
    try:
        from pypdf import PdfReader, PdfWriter
    except Exception as exc:  # pragma: no cover - dependente do ambiente
        raise ReceituarioPdfTemplateError(
            "Geracao do receituario PDF indisponivel: dependencia pypdf nao instalada."
        ) from exc
    return PdfReader, PdfWriter


def _safe_text(value) -> str:
    return str(value or "").strip()


def _safe_multiline(value) -> str:
    return str(value or "").replace("\r\n", "\n").replace("\r", "\n").strip()


def _load_template_reader(template_path: Path):
    PdfReader, _ = _load_pypdf()
    if not template_path.exists():
        raise ReceituarioPdfTemplateError(f"Template PDF nao encontrado: {template_path.name}")
    reader = PdfReader(str(template_path))
    if reader.is_encrypted:
        try:
            reader.decrypt("")
        except Exception as exc:
            raise ReceituarioPdfTemplateError(
                f"Falha ao abrir o template PDF protegido: {template_path.name}"
            ) from exc
    return reader


def _build_field_map(
    *,
    paciente_nome: str,
    corpo_receita: str,
    data_emissao: str | None,
) -> dict[str, str]:
    return {
        "Nome": _safe_text(paciente_nome),
        "Prescirção": _safe_multiline(corpo_receita),
        "Data de emissão": _safe_text(data_emissao) or datetime.now().strftime("%d/%m/%Y"),
    }


def generate_receituario_acroform_pdf_bytes(
    *,
    clinica_nome: str,
    clinica_endereco: str,
    clinica_cidade_estado: str,
    clinica_telefones: str,
    paciente_nome: str,
    paciente_endereco: str,
    paciente_cidade_estado: str,
    paciente_data_nascimento: str,
    paciente_idade: str,
    corpo_receita: str,
    data_emissao: str | None = None,
    titulo: str = "Receituario",
    field_name: str = "Assinatura",
    template_path: str | None = None,
) -> bytes:
    _ = (
        clinica_nome,
        clinica_endereco,
        clinica_cidade_estado,
        clinica_telefones,
        paciente_endereco,
        paciente_cidade_estado,
        paciente_data_nascimento,
        paciente_idade,
        field_name,
    )
    try:
        _, PdfWriter = _load_pypdf()
        chosen_template = Path(str(template_path or "")).expanduser() if str(template_path or "").strip() else DEFAULT_RECEITUARIO_TEMPLATE
        reader = _load_template_reader(chosen_template)
        writer = PdfWriter()
        writer.clone_document_from_reader(reader)
        writer.set_need_appearances_writer(True)
        writer.update_page_form_field_values(
            writer.pages[0],
            _build_field_map(
                paciente_nome=paciente_nome,
                corpo_receita=corpo_receita,
                data_emissao=data_emissao,
            ),
            auto_regenerate=True,
            flatten=False,
        )
        metadata = {
            "/Title": _safe_text(titulo) or "Receituario",
            "/Author": _safe_text(clinica_nome) or "Brana SaaS",
            "/Subject": "Receituario",
            "/Creator": "Brana SaaS",
        }
        try:
            writer.add_metadata(metadata)
        except Exception:
            pass
        output = io.BytesIO()
        writer.write(output)
        pdf_bytes = output.getvalue()
        if not pdf_bytes:
            raise ReceituarioPdfTemplateError("Falha ao gerar o receituario PDF.")
        return pdf_bytes
    except ReceituarioPdfTemplateError:
        raise
    except Exception as exc:
        raise ReceituarioPdfTemplateError(f"Falha ao gerar o receituario PDF: {exc}") from exc
