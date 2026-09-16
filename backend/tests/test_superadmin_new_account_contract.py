import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SUPERADMIN_ROUTES = ROOT / "backend" / "routes" / "superadmin_routes.py"
SIGNUP_SERVICE = ROOT / "backend" / "services" / "signup_service.py"
CLINICS_PAGE = ROOT / "frontend-react" / "src" / "features" / "admin" / "clinics" / "ClinicsPage.jsx"
CLINICS_TOOLBAR = ROOT / "frontend-react" / "src" / "features" / "admin" / "clinics" / "components" / "ClinicsToolbarContent.jsx"


class SuperAdminNewAccountContractTest(unittest.TestCase):
    def test_backend_endpoint_is_owner_only_and_uses_signup_provisioning(self):
        routes = SUPERADMIN_ROUTES.read_text(encoding="utf-8")
        service = SIGNUP_SERVICE.read_text(encoding="utf-8")

        self.assertIn('@router.post("/clinicas/nova-conta")', routes)
        self.assertIn("SuperAdminCreateClinicAccountPayload", routes)
        self.assertIn('extra = "forbid"', routes)
        self.assertIn("_require_owner(current_user)", routes)
        self.assertIn("is_owner_email(current_user.email)", routes)
        self.assertIn("provisionar_conta_saas(", routes)
        self.assertIn("registrar_auditoria(", routes)
        self.assertIn('"admin_setup_completed": bool(usuario_admin.setup_completed)', routes)
        self.assertNotIn("create_access_token", routes)
        self.assertNotIn("send_verification_code", routes)

        self.assertIn("def provisionar_conta_saas(db, nome_clinica, admin_nome, admin_email, admin_senha):", service)
        self.assertIn("nome=nome_clinica", service)
        self.assertIn("nome=admin_nome", service)
        self.assertIn("email=admin_email", service)
        self.assertIn("setup_completed=False", service)
        self.assertIn("db.rollback()", service)
        self.assertIn("_remover_diretorios_modelos_clinica_se_seguro(clinica.id)", service)
        self.assertIn("def criar_conta_saas(db, nome, email, senha):", service)
        self.assertIn("nome_clinica=nome", service)
        self.assertIn("admin_nome=nome", service)

    def test_frontend_replaces_novo_usuario_with_owner_only_nova_conta(self):
        page = CLINICS_PAGE.read_text(encoding="utf-8")
        toolbar = CLINICS_TOOLBAR.read_text(encoding="utf-8")

        self.assertIn("canCreateAccount = Boolean(user?.is_master)", page)
        self.assertIn("useCreateAdminClinicAccount", page)
        self.assertIn("CreateClinicAccountModal", page)
        self.assertIn("clinics.setSelectedId(Number(result.clinica_id))", page)
        self.assertNotIn("Novo usuário", toolbar)
        self.assertIn("Nova conta", toolbar)
        self.assertIn("canCreateAccount ? (", toolbar)
        self.assertIn("onCreateAccount?.()", toolbar)


if __name__ == "__main__":
    unittest.main()
