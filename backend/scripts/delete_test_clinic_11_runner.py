from __future__ import annotations

import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import delete_test_clinic_15_runner as base


base.FIXED_CLINICA_ID = 11
base.FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
base.EXPECTED_CLINICA_NAME = "Tel"
base.EXPECTED_USER_IDS = {25, 26}
base.EXPECTED_SYSTEM_USER_ID = 25
base.EXPECTED_ADMIN_USER_ID = 26
base.EXPECTED_PRESTADOR_ID = 16
base.EXPECTED_ACCESS_PROFILE_COUNT = 10
base.EXPECTED_ACCESS_PROFILE_NAMES = [
    "Agenda de horarios",
    "Controle de estoque",
    "Controle de protetico",
    "Controle de recibos",
    "Creditos na conta corrente",
    "Debitos na conta corrente",
    "Intervencoes",
    "Pacientes",
    "Relatorios estatisticos",
    "Relatorios financeiros",
]


def _validate_users_clinica_11(users):
    ids = {int(user["id"]) for user in users}
    if ids != base.EXPECTED_USER_IDS:
        raise RuntimeError(f"execucao bloqueada: usuarios inesperados={sorted(ids)}")
    by_id = {int(user["id"]): user for user in users}
    sys_user = by_id.get(base.EXPECTED_SYSTEM_USER_ID)
    admin_user = by_id.get(base.EXPECTED_ADMIN_USER_ID)
    if not sys_user or not admin_user:
        raise RuntimeError("execucao bloqueada: usuarios esperados nao encontrados")
    if str(sys_user.get("email", "")).lower() != "clinica.255.c11@system.brana.local":
        raise RuntimeError("execucao bloqueada: usuario sistema divergente")
    if str(admin_user.get("email", "")).lower() != base.FIXED_EXPECTED_EMAIL.lower():
        raise RuntimeError("execucao bloqueada: usuario admin divergente")
    if not bool(sys_user.get("is_system_user")) or bool(sys_user.get("is_admin")):
        raise RuntimeError("execucao bloqueada: flags do usuario sistema divergentes")
    if not bool(admin_user.get("is_admin")) or bool(admin_user.get("is_system_user")):
        raise RuntimeError("execucao bloqueada: flags do usuario admin divergentes")


base.validate_users = _validate_users_clinica_11


if __name__ == "__main__":
    base.main()
