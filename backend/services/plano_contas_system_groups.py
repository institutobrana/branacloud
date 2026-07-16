import re
import unicodedata

SYSTEM_PROTECTED_GROUP_NAMES = frozenset(
    {
        "CUSTO FIXO PESSOAL",
        "CUSTO FIXO PROFISSIONAL",
        "CUSTO VARIAVEL PESSOAL",
        "CUSTO VARIAVEL PROFISSIONAL",
        "INVESTIMENTO - EMPRESA",
        "INVESTIMENTO - PESSOAL",
    }
)

SYSTEM_PROTECTED_GROUP_ALIASES = frozenset(
    {
        "CUSTO VARIVAVEL PROFISSIONAL",
        "INVESTIMENTOS - EMPRESA",
        "INVESTIMENTOS - PESSOAL",
    }
)


def normalize_financial_group_name(value: str | None) -> str:
    text = str(value or "").strip()
    if not text:
        return ""
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    text = re.sub(r"\s*-\s*", " - ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip().upper()


def is_system_protected_group_name(value: str | None) -> bool:
    normalized = normalize_financial_group_name(value)
    return bool(normalized) and (
        normalized in SYSTEM_PROTECTED_GROUP_NAMES or normalized in SYSTEM_PROTECTED_GROUP_ALIASES
    )
