from datetime import date

from backend.routes.agenda_legado_routes import (
    AgendaRepeticaoPayload,
    _datas_repeticao,
    _normalizar_data_mes_sem_domingo,
)


def repeat_dates(base_date, **values):
    payload = AgendaRepeticaoPayload(item_id=1, modo="meses", **values)
    return _datas_repeticao(base_date, payload)


def test_monthly_sunday_moves_to_next_monday_across_month_boundary():
    assert _normalizar_data_mes_sem_domingo(date(2026, 5, 31)) == date(2026, 6, 1)
    assert repeat_dates(date(2026, 4, 30), dia_mes=31, qtd_meses=1) == [date(2026, 6, 1)]


def test_monthly_day_one_sunday_moves_to_monday():
    assert _normalizar_data_mes_sem_domingo(date(2026, 11, 1)) == date(2026, 11, 2)


def test_monthly_mid_month_sunday_moves_to_monday():
    assert _normalizar_data_mes_sem_domingo(date(2026, 8, 16)) == date(2026, 8, 17)


def test_non_sunday_dates_remain_unchanged():
    assert _normalizar_data_mes_sem_domingo(date(2026, 8, 15)) == date(2026, 8, 15)
    assert _normalizar_data_mes_sem_domingo(date(2026, 8, 17)) == date(2026, 8, 17)


def test_monthly_invalid_day_clamps_before_sunday_normalization():
    assert repeat_dates(date(2026, 7, 31), dia_mes=31, qtd_meses=1) == [date(2026, 8, 31)]
