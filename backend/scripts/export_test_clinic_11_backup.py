from __future__ import annotations

import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

import export_test_clinic_15_backup as base


base.FIXED_CLINICA_ID = 11
base.FIXED_EXPECTED_EMAIL = "institutobrana@gmail.com"
base.BACKUP_DIR = base.PROJECT_ROOT / "backups" / "clinica_11_pre_exclusao"


if __name__ == "__main__":
    base.main()
