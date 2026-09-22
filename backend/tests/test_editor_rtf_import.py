import unittest


class EditorRtfImportTests(unittest.TestCase):
    @staticmethod
    def _route():
        from routes import editor_textos_routes as route
        return route

    def test_raw_rtf_text_converts_in_memory_with_codepage_paragraphs_and_literal_token(self):
        route = self._route()
        source = r"{\rtf1\ansi\ansicpg1252{\fonttbl{\f0 Arial;}}\fs24\b S\'e3o\b0\par\qc <<Paciente.NomeCompleto>>}"
        result = route._convert_rtf_for_import(source)
        self.assertFalse(result["persisted"])
        self.assertEqual(result["format"], "rtf")
        self.assertIn("São", result["html"])
        self.assertIn("<p>", result["html"])
        self.assertIn("&lt;&lt;Paciente.NomeCompleto&gt;&gt;", result["html"])
        self.assertTrue(any("Importação RTF parcial" in warning for warning in result["warnings"]))
        self.assertTrue(any("Família e tamanho" in warning for warning in result["warnings"]))
        self.assertEqual(result["classification"], "RTF_PARTIAL_FORMATTING")

    def test_rtf_physical_geometry_converts_twips_to_mm_and_oasis_css_pixels(self):
        route = self._route()
        result = route._convert_rtf_for_import(r"{\rtf1\paperw3781\paperh1440\margl57\margr0\margt57\margb0 Texto}")
        self.assertEqual(result["page_config"]["largura_mm"], 66.69)
        self.assertEqual(result["page_config"]["altura_mm"], 25.4)
        self.assertEqual(result["page_config"]["margem_esquerda_mm"], 1.01)
        self.assertEqual(result["page_config"]["margem_inferior_mm"], 0.0)
        self.assertEqual(result["page_config"]["orientacao"], "Paisagem")
        self.assertAlmostEqual(result["page_settings"]["width"], 252.06, places=2)
        self.assertAlmostEqual(result["page_settings"]["height"], 96.0, places=2)
        self.assertEqual(result["page_settings"]["orientation"], "landscape")

    def test_rtf_geometry_orientation_and_section_controls_override_document_defaults(self):
        route = self._route()
        result = route._convert_rtf_for_import(r"{\rtf1\paperw12240\paperh15840\margl1440\landscape\pgwsxn3600\pghsxn1757\marglsxn57\margbsxn0 Texto}")
        self.assertEqual(result["page_config"]["largura_mm"], 63.5)
        self.assertEqual(result["page_config"]["altura_mm"], 30.99)
        self.assertEqual(result["page_config"]["margem_esquerda_mm"], 1.01)
        self.assertEqual(result["page_config"]["orientacao"], "Paisagem")
        self.assertEqual(result["page_settings"]["orientation"], "landscape")
        landscape_paper = route._convert_rtf_for_import(r"{\rtf1\paperw12240\paperh15840\landscape texto}")["page_config"]
        self.assertEqual((landscape_paper["largura_mm"], landscape_paper["altura_mm"]), (279.4, 215.9))

    def test_real_label_and_atestado_geometry_is_read_from_rtf_and_page_config_roundtrips(self):
        from pathlib import Path

        route = self._route()
        root = Path(__file__).resolve().parents[2]
        samples = {
            "Pimaco6080.mod": (66.69, 25.4, "Paisagem"),
            "PimacoA4255.mod": (63.5, 30.99, "Paisagem"),
            "Atestado.mod": (215.9, 279.4, "Retrato"),
        }
        for name, expected in samples.items():
            source = (root / "storage" / "modelos" / "clinicas" / "1" / name).read_text(encoding="cp1252")
            converted = route._convert_rtf_for_import(source)
            page_config = converted["page_config"]
            self.assertEqual((page_config["largura_mm"], page_config["altura_mm"], page_config["orientacao"]), expected, name)
            self.assertEqual(route._normalize_page_config(page_config), page_config, name)
            self.assertEqual(converted["page_settings"]["margins"]["header"], 0, name)
            self.assertEqual(converted["page_settings"]["margins"]["footer"], 0, name)

    def test_real_label_has_no_explicit_page_breaks_and_keeps_zero_spacing_with_usable_body(self):
        from pathlib import Path
        import re

        route = self._route()
        root = Path(__file__).resolve().parents[2] / "storage" / "modelos" / "clinicas" / "1"
        for name, expected_page_height in (("Pimaco6080.mod", 96.0), ("PimacoA4255.mod", 117.1276)):
            source = (root / name).read_bytes().decode("cp1252")
            converted = route._convert_rtf_for_import(source)
            controls = [item["word"] for item in route._scan_rtf_structure(source)[1]]
            self.assertNotIn("page", controls, name)
            self.assertFalse(set(controls) & {"sect", "sectd"}, name)
            self.assertEqual(controls.count("par"), 4, name)
            self.assertEqual(converted["html"].count("<p "), 5, name)
            self.assertNotRegex(converted["html"], r"page-break|pageBreak")
            self.assertTrue(all(float(value) == 0 for value in re.findall(r'data-rtf-spacing-(?:before|after)-pt="(-?\d+(?:\.\d+)?)"', converted["html"])))
            settings = converted["page_settings"]
            body_top = max(settings["margins"]["top"], settings["margins"]["header"])
            body_bottom = min(settings["height"] - settings["margins"]["bottom"], settings["height"] - settings["margins"]["footer"])
            self.assertEqual(settings["height"], expected_page_height, name)
            self.assertGreater(body_bottom - body_top, 70, name)

    def test_capability_fixtures_cover_safe_partial_supported_poc_and_invalid_classes(self):
        route = self._route()
        fixtures = (
            (r"{\rtf1 texto simples}", "RTF_SAFE_TEXTUAL", True, []),
            (r"{\rtf1\b texto\b0}", "RTF_PARTIAL_FORMATTING", True, []),
            (r"{\rtf1{\field{\*\fldinst INCLUDEPICTURE logo.bmp}}}", "RTF_PARTIAL_FORMATTING", True, []),
            (r"{\rtf1\trowd\cellx1000\cellx2000\intbl A\cell B\cell\row}", "RTF_SAFE_TEXTUAL", True, []),
            (r"{\rtf1\trgaph120\trleft-120\intbl A\cell}", "RTF_UNSUPPORTED_STRUCTURED", False, ["table_unsupported_shape"]),
            (r"{\rtf1{\*\wptools 5457504F496D616765}}", "RTF_PARTIAL_FORMATTING", True, []),
            (r"{\rtf1{\field{\*\fldinst UNKNOWNFIELD foo}{\fldrslt valor visível}}}", "RTF_UNSUPPORTED_STRUCTURED", False, ["field_unknown"]),
            (r"{\rtf1\rtlch texto}", "RTF_UNSUPPORTED_STRUCTURED", False, ["right_to_left_text"]),
            (r"{\rtf1 <<Paciente.NomeCompleto>>}", "RTF_SAFE_TEXTUAL", True, []),
            (r"{\rtf1 texto", "RTF_INVALID", False, []),
            (r"{\rtf1{\field{\*\fldinst INCLUDEPICTURE logo.bmp}}\trowd\cellx1000\intbl A\cell\row{\*\wptools 5457504F496D616765}}", "RTF_PARTIAL_FORMATTING", True, []),
        )
        for source, classification, supported, structural_features in fixtures:
            with self.subTest(classification=classification, source=source[:35]):
                result = route.analyze_rtf_capabilities(source)
                self.assertEqual(result["classification"], classification)
                self.assertEqual(result["supported"], supported)
                for feature in structural_features:
                    self.assertIn(feature, result["structural_loss_features"])

    def test_literal_merge_tokens_are_text_and_txt_rtf_uses_same_policy(self):
        route = self._route()
        rtf = r"{\rtf1 Clínica: <<Paciente.NomeCompleto>>\par São José}"
        txt_named_rtf = route.analyze_rtf_capabilities(rtf)
        rtf_named_rtf = route.analyze_rtf_capabilities(rtf)
        self.assertEqual(txt_named_rtf, rtf_named_rtf)
        self.assertTrue(txt_named_rtf["supported"])
        self.assertIn("literal_merge_tokens", txt_named_rtf["features"])

    def test_legacy_trailing_nul_padding_is_removed_but_embedded_nul_is_rejected(self):
        route = self._route()
        source = r"{\rtf1 texto}" + "\r\n\x00"
        result = route._convert_rtf_for_import(source)
        self.assertNotIn("\x00", result["html"])
        self.assertIn("trailing_legacy_padding_removed", result["features"])
        embedded = route.analyze_rtf_capabilities(r"{\rtf1 tex" + "\x00" + r"to}")
        self.assertEqual(embedded["classification"], "RTF_INVALID")

    def test_converter_uses_image_placeholders_and_preserves_table_cells(self):
        route = self._route()
        source = r"{\rtf1\trowd\cellx1000\cellx2000\intbl A <<Paciente.NomeCompleto>>\cell\intbl\b B\b0\cell\row{\pict\pngblip 00}}"
        result = route._convert_rtf_for_import(source)
        self.assertIn("<table>", result["html"])
        self.assertEqual(result["html"].count("<td>"), 2)
        self.assertIn("A &lt;&lt;Paciente.NomeCompleto&gt;&gt;", result["html"])
        self.assertIn("<strong>B</strong>", result["html"])
        self.assertIn("[Imagem não importada]", result["html"])
        self.assertTrue(any("placeholder" in warning.lower() for warning in result["warnings"]))

    def test_converter_exports_font_paragraph_spacing_tabs_and_simple_borders(self):
        route = self._route()
        source = (
            r"{\rtf1{\fonttbl{\f0 Arial;}{\f1 Times New Roman;}{\f2 Courier New;}}"
            r"\f1\fs22\qc\li720\ri360\fi-240\sb120\sa240\sl360\slmult0"
            r"\tqc\tx1440\tqr\tx2880\box\brdrs\brdrw8 Texto\par}"
        )
        html = route._rtf_to_html(source)
        self.assertIn('data-rtf-font-family="Times New Roman"', html)
        self.assertIn('data-rtf-font-size-pt="11"', html)
        self.assertIn('text-align:center', html)
        self.assertIn('data-rtf-indent-left-pt="36"', html)
        self.assertIn('data-rtf-indent-right-pt="18"', html)
        self.assertIn('data-rtf-indent-first-pt="-12"', html)
        self.assertIn('data-rtf-spacing-before-pt="6"', html)
        self.assertIn('data-rtf-spacing-after-pt="12"', html)
        self.assertIn('data-rtf-line-spacing="18"', html)
        self.assertIn('data-rtf-tabs=', html)
        self.assertIn('&quot;type&quot;:&quot;center&quot;', html)
        self.assertIn('&quot;type&quot;:&quot;right&quot;', html)
        self.assertIn('data-rtf-borders=', html)
        self.assertIn('&quot;top&quot;', html)
        self.assertIn('&quot;left&quot;', html)

    def test_sl1000_uses_rtf_natural_spacing_sentinel_and_preserves_other_line_spacing(self):
        route = self._route()
        natural = route._rtf_to_html(r"{\rtf1\ansi\sl1000\fs20 Texto\par\sl1000\fs24 Outro\par}")
        self.assertEqual(natural.count("<p "), 0)
        self.assertNotIn("data-rtf-line-spacing", natural)

        natural_at_least = route._rtf_to_html(r"{\rtf1\ansi\sl1000\slmult0\fs20 Texto\par}")
        self.assertNotIn("data-rtf-line-spacing", natural_at_least)

        multiple = route._rtf_to_html(r"{\rtf1\ansi\sl1000\slmult1\fs20 Texto\par}")
        self.assertIn('data-rtf-line-spacing="4.16667"', multiple)
        self.assertIn('data-rtf-line-rule="auto"', multiple)

        explicit = route._rtf_to_html(r"{\rtf1\ansi\sl360\slmult0\fs20 Texto\par}")
        self.assertIn('data-rtf-line-spacing="18"', explicit)
        self.assertIn('data-rtf-line-rule="exact"', explicit)

    def test_pimaco6083_rtf_sentinel_does_not_emit_fifty_point_paragraph_lines(self):
        from pathlib import Path

        route = self._route()
        root = Path(__file__).resolve().parents[2]
        source = (root / "storage" / "modelos" / "clinicas" / "1" / "ETIQUETA-pimaco6083.mod").read_bytes().decode("cp1252")
        self.assertEqual(source.count(r"\sl1000"), 7)
        self.assertNotIn(r"\slmult", source)
        html = route._rtf_to_html(source)
        self.assertNotIn("data-rtf-line-spacing", html)
        self.assertEqual(html.count("<p"), 5)
        self.assertIn("Paciente.NomeCompleto", html)

    def test_sl1000_rule_does_not_change_the_other_nine_label_variants(self):
        from pathlib import Path

        route = self._route()
        root = Path(__file__).resolve().parents[2] / "storage" / "modelos"
        samples = (
            ("base/etiquetas/Envelope.mod", (79.99, 30.0)),
            ("base/etiquetas/Pimaco6080.mod", (66.69, 25.4)),
            ("base/etiquetas/Pimaco6081.mod", (101.6, 25.4)),
            ("base/etiquetas/PimacoA4254.mod", (99.01, 25.4)),
            ("base/etiquetas/PimacoA4255.mod", (63.5, 30.99)),
            ("base/etiquetas/PimacoA4256.mod", (63.5, 25.4)),
            ("clinicas/1/Etiqueta_LAB.mod", (99.01, 25.4)),
            ("clinicas/1/ISCA_ABELHAS.mod", (101.6, 50.8)),
            ("clinicas/1/LAB_PimacoA4255.mod", (63.5, 30.99)),
        )
        for relative_path, expected_size in samples:
            with self.subTest(file=relative_path):
                source = (root / relative_path).read_bytes().decode("cp1252")
                self.assertNotIn(r"\sl1000", source)
                converted = route._convert_rtf_for_import(source)
                self.assertNotIn("data-rtf-line-spacing", converted["html"])
                self.assertEqual(converted["classification"], "RTF_PARTIAL_FORMATTING")
                config = converted["page_config"]
                self.assertEqual((config["largura_mm"], config["altura_mm"]), expected_size)

    def test_missing_image_placeholders_are_deduplicated_by_logical_reference(self):
        route = self._route()
        repeated_reference = (
            r'{\rtf1{\field{\*\fldinst INCLUDEPICTURE "C:\Easy50\Logo4.bmp"}}'
            r' texto {\field{\*\fldinst INCLUDEPICTURE "c:/easy50/logo4.BMP"}}}'
        )
        result = route._convert_rtf_for_import(repeated_reference)
        self.assertEqual(result["html"].count("[Imagem não importada]"), 1)

        distinct_references = (
            r'{\rtf1{\field{\*\fldinst INCLUDEPICTURE "C:\Easy50\Logo4.bmp"}}'
            r'{\field{\*\fldinst INCLUDEPICTURE "C:\Easy50\Logo5.bmp"}}}'
        )
        result = route._convert_rtf_for_import(distinct_references)
        self.assertEqual(result["html"].count("[Imagem não importada]"), 2)

    def test_duplicate_embedded_image_group_is_rendered_once(self):
        route = self._route()
        source = r"{\rtf1{\pict\pngblip 89504e470d0a}{\pict\pngblip 89504e470d0a}}"
        result = route._convert_rtf_for_import(source)
        self.assertEqual(result["html"].count("[Imagem não importada]"), 1)

    def test_rejects_non_cp1252_codepages_and_classifies_fields_by_meaning(self):
        route = self._route()
        with self.assertRaisesRegex(ValueError, "codepage diferente"):
            route._convert_rtf_for_import(r"{\rtf1\ansi\ansicpg1251 texto}")
        analysis = route.analyze_rtf_capabilities(r"{\rtf1{\field{\*\fldinst MERGEFIELD Nome}{\fldrslt Nome}}}")
        self.assertEqual(analysis["classification"], "RTF_UNSUPPORTED_STRUCTURED")
        self.assertIn("field_merge", analysis["structural_loss_features"])
        with self.assertRaisesRegex(ValueError, "campo Word de mesclagem"):
            route._convert_rtf_for_import(r"{\rtf1{\field{\*\fldinst MERGEFIELD Nome}{\fldrslt Nome}}}")

    def test_known_font_charsets_are_metadata_and_ansi_text_uses_document_codepage(self):
        route = self._route()
        source = (
            r"{\rtf1\ansi{\fonttbl{\f0\fnil\fcharset1 Arial;}"
            r"{\f1\fnil\fcharset204 Times New Roman Cyr;}"
            r"{\f2\fnil\fcharset2 Wingdings;}}"
            r"\deff0\f0 S\'e3o Jos\'e9 \f2\'fc\f0 A\'e7\'e3o}"
        )
        result = route._convert_rtf_for_import(source)
        self.assertIn("São José", result["html"])
        self.assertIn("Ação", result["html"])
        self.assertIn('data-rtf-font-family="Wingdings"', result["html"])

    def test_unknown_selected_font_charset_is_still_rejected(self):
        route = self._route()
        unknown_charset = r"{\rtf1{\fonttbl{\f0\fnil\fcharset999 Unknown;}}\deff0\f0 texto}"
        with self.assertRaisesRegex(ValueError, "charset de fonte não suportado"):
            route._convert_rtf_for_import(unknown_charset)

    def test_real_exame_sangue_implante_rtf_preserves_portuguese_text(self):
        from pathlib import Path

        route = self._route()
        sample = Path(__file__).resolve().parents[2] / "storage" / "modelos" / "clinicas" / "1" / "EXAME_SANGUE_IMPLANTE_BRANA.rtf"
        source = sample.read_bytes().decode("cp1252")
        analysis = route.analyze_rtf_capabilities(source)
        self.assertTrue(analysis["supported"])
        self.assertEqual(analysis["classification"], "RTF_PARTIAL_FORMATTING")
        converted = route._convert_rtf_for_import(source)
        self.assertIn("CÁLCIO", converted["html"])
        self.assertIn("SÓDIO", converted["html"])
        self.assertNotIn("\ufffd", converted["html"])

    def test_blocks_unsupported_shapes_fields_and_unbalanced_groups(self):
        route = self._route()
        for source, reason in (
            (r"{\rtf1\intbl sem-linha-recuperável}", "tabela"),
            (r"{\rtf1{\field{\*\fldinst MERGEFIELD Nome}{\fldrslt Nome}}}", "campo Word de mesclagem"),
            (r"{\rtf1{\*\wptools payload proprietário sem assinatura conhecida}}", "proprietário"),
            (r"{\rtf1 texto", "grupos desbalanceados"),
        ):
            with self.subTest(reason=reason), self.assertRaisesRegex(ValueError, reason):
                route._convert_rtf_for_import(source)

    def test_poc_ignores_only_wpprheadfoot_zero_and_list_definitions_without_instances(self):
        route = self._route()
        safe = route.analyze_rtf_capabilities(r"{\rtf1\wpprheadfoot0{\*\pnseclvl1\pndec\pnstart1} texto}")
        self.assertTrue(safe["supported"])
        self.assertIn("wpprheadfoot0_metadata", safe["features"])
        self.assertIn("list_definitions_metadata_only", safe["features"])
        blocked = route.analyze_rtf_capabilities(r"{\rtf1\wpprheadfoot1 texto}")
        self.assertFalse(blocked["supported"])
        self.assertIn("header_footer", blocked["structural_loss_features"])

    def test_label_allows_root_wptools_version_and_header_footer_offsets_without_reserving_body(self):
        route = self._route()
        source = r"{\rtf1\ansi\wptoolsver4\paperw5760\paperh2880\margl227\margr227\margt72\margb0\headery720\footery720 texto\par}"
        result = route._convert_rtf_for_import(source)
        self.assertTrue(result["classification"] == "RTF_PARTIAL_FORMATTING")
        self.assertIn("wptools_version_metadata", result["features"])
        self.assertEqual(result["page_config"]["largura_mm"], 101.6)
        self.assertEqual(result["page_config"]["altura_mm"], 50.8)
        self.assertEqual(result["page_settings"]["margins"]["header"], 0)
        self.assertEqual(result["page_settings"]["margins"]["footer"], 0)
        self.assertNotIn("headery", result["html"])
        self.assertNotIn("footery", result["html"])

        nested_version = route.analyze_rtf_capabilities(r"{\rtf1{\*\metadata\wptoolsver4} texto}")
        self.assertFalse(nested_version["supported"])
        self.assertIn("unknown_control", nested_version["structural_loss_features"])

        actual_header = route.analyze_rtf_capabilities(r"{\rtf1\headery720{\header texto} corpo}")
        self.assertFalse(actual_header["supported"])
        self.assertIn("header_footer", actual_header["structural_loss_features"])

    def test_real_clinic_label_corpus_importability_after_named_control_allowlist(self):
        from pathlib import Path

        route = self._route()
        label_dir = Path(__file__).resolve().parents[2] / "storage" / "modelos" / "clinicas" / "1"
        label_names = (
            "Pimaco6080.mod", "Pimaco6081.mod", "PimacoA4254.mod",
            "PimacoA4255.mod", "PimacoA4256.mod", "Envelope.mod",
            "ETIQUETA-pimaco6083.mod", "Etiqueta_LAB.mod",
            "LAB_PimacoA4255.mod", "ISCA_ABELHAS.mod",
        )
        for name in label_names:
            with self.subTest(name=name):
                source = (label_dir / name).read_bytes().decode("cp1252")
                result = route._convert_rtf_for_import(source)
                self.assertTrue(result["html"].strip())
                self.assertTrue(result["page_config"])
                self.assertEqual(result["classification"], "RTF_PARTIAL_FORMATTING")


    def test_poc_maps_explicit_numbered_and_bullet_list_instances_only(self):
        route = self._route()
        fixtures = (
            (r"{\rtf1{\pntext 1.}{\*\pn\pndec\pnlvl0}\pard Primeiro\par{\pntext 2.}{\*\pn\pndec\pnlvl0}\pard Segundo\par}", "ordered"),
            (r"{\rtf1{\pntext bullet}{\*\pn\pnlvlblt\pnlvl0}\pard Item\par}", "bullet"),
        )
        for source, kind in fixtures:
            with self.subTest(kind=kind):
                result = route._convert_rtf_for_import(source)
                self.assertIn(f'data-rtf-list-kind="{kind}"', result["html"])
                self.assertIn("list_instances", result["features"])
        untyped = route.analyze_rtf_capabilities(r"{\rtf1{\pntext 1.}\pard item\par}")
        self.assertFalse(untyped["supported"])
        self.assertIn("list_instance_unknown", untyped["structural_loss_features"])

    def test_classifies_alignment_and_tabs_as_cosmetic_but_page_break_as_structural(self):
        route = self._route()
        analysis = route.analyze_rtf_capabilities(r"{\rtf1\qc A\tab B\par}")
        self.assertEqual(analysis["classification"], "RTF_PARTIAL_FORMATTING")
        self.assertIn("tab_alignment", analysis["cosmetic_loss_features"])
        self.assertIn("paragraph_alignment", analysis["cosmetic_loss_features"])
        result = route._convert_rtf_for_import(r"{\rtf1\qc A\tab B\par}")
        self.assertTrue(any("Tabulações" in warning for warning in result["warnings"]))
        self.assertIn('text-align:center', result["html"])
        page_break = route.analyze_rtf_capabilities(r"{\rtf1 A\page B}")
        self.assertEqual(page_break["classification"], "RTF_UNSUPPORTED_STRUCTURED")
        self.assertIn("page_break_or_section", page_break["structural_loss_features"])

    def test_unpreserved_character_and_paragraph_presentation_is_warned_not_silently_dropped(self):
        route = self._route()
        analysis = route.analyze_rtf_capabilities(r"{\rtf1\cf1\uldb\keepn texto}")
        self.assertEqual(analysis["classification"], "RTF_PARTIAL_FORMATTING")
        self.assertIn("inline_character_formatting", analysis["cosmetic_loss_features"])
        self.assertIn("paragraph_spacing_or_indents", analysis["cosmetic_loss_features"])

    def test_known_legacy_paragraph_controls_are_partial_not_unknown_but_other_controls_still_block(self):
        route = self._route()
        atestado_controls = route.analyze_rtf_capabilities(
            r"{\rtf1{\tqc\tx4320\tqr\tx8480\qc\toc1\plain Endereço: São José\par}}"
        )
        self.assertTrue(atestado_controls["supported"])
        self.assertEqual(atestado_controls["classification"], "RTF_PARTIAL_FORMATTING")
        self.assertNotIn("unknown_control", atestado_controls["structural_loss_features"])
        self.assertIn("tab_alignment", atestado_controls["cosmetic_loss_features"])
        self.assertIn("paragraph_style_metadata", atestado_controls["cosmetic_loss_features"])
        self.assertTrue(any("sumário" in warning.lower() for warning in atestado_controls["warnings"]))

        contract_borders = route.analyze_rtf_capabilities(
            r"{\rtf1{\brdrbtw\box\brdrs\brdrt\brdrs\brdrb\brdrs\brdrl\brdrs\brdrr\brdrs\brdrw0\qc CONTRATO\par}}"
        )
        self.assertTrue(contract_borders["supported"])
        self.assertEqual(contract_borders["classification"], "RTF_PARTIAL_FORMATTING")
        self.assertNotIn("unknown_control", contract_borders["structural_loss_features"])
        self.assertIn("paragraph_borders", contract_borders["cosmetic_loss_features"])
        self.assertTrue(any("bordas" in warning.lower() for warning in contract_borders["warnings"]))

        unknown = route.analyze_rtf_capabilities(r"{\rtf1\unprovenlegacy payload}")
        self.assertFalse(unknown["supported"])
        self.assertIn("\\unprovenlegacy", unknown["reason"])

    def test_existing_public_route_is_module_gated_and_does_not_accept_a_file_path(self):
        route = self._route()
        self.assertTrue(route.router.dependencies)
        fields = route.RtfImportPayload.model_fields
        self.assertEqual(set(fields), {"content"})

    def test_http_route_returns_in_memory_html_and_rejects_unsupported_codepage(self):
        from fastapi import FastAPI
        from fastapi.testclient import TestClient

        route = self._route()
        app = FastAPI()
        app.include_router(route.router)
        for dependency in route.router.dependencies:
            app.dependency_overrides[dependency.dependency] = lambda: True
        client = TestClient(app)
        result = client.post("/editor-textos/import/rtf", json={"content": r"{\rtf1\ansi\ansicpg1252 texto}"})
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json()["persisted"], False)
        self.assertEqual(result.json()["page_config"]["largura_mm"], 215.9)
        self.assertEqual(result.json()["page_settings"]["width"], 816.0)
        self.assertIn("<p>", result.json()["html"])
        partial = client.post("/editor-textos/import/rtf", json={"content": r"{\rtf1\b texto\b0}"})
        self.assertEqual(partial.status_code, 200)
        self.assertEqual(partial.json()["classification"], "RTF_PARTIAL_FORMATTING")
        blocked = client.post("/editor-textos/import/rtf", json={"content": r"{\rtf1\ansi\ansicpg1251 texto}"})
        self.assertEqual(blocked.status_code, 422)
        structured = client.post("/editor-textos/import/rtf", json={"content": r"{\rtf1\trowd\cellx1000\cellx2000\intbl A\cell\intbl B\cell\row}"})
        self.assertEqual(structured.status_code, 200)
        self.assertIn("<table>", structured.json()["html"])
        self.assertEqual(structured.json()["html"].count("<td>"), 2)


if __name__ == "__main__":
    unittest.main()
