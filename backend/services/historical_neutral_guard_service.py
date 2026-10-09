"""Reviewed historical sentinel guard; no bootstrap, env or application imports.

Only the separately authorized recovery operator installs this contract. Normal
catalog identities are not protected merely because they use the same code/name.
Unknown triggers or altered functions are refused, never silently allowlisted.
"""
import hashlib
from sqlalchemy import text

NEUTRAL_CODE = '0207'
NEUTRAL_NAME = 'Sem classificação clínica histórica'
IDENTITY_FUNCTION = 'brana_historical_neutral_identity_guard'
COMPOSITION_FUNCTION = 'brana_historical_neutral_composition_guard'
IDENTITY_BODY = """
BEGIN
 IF OLD.id = TG_ARGV[0]::integer THEN
  RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'Historical neutral Generic identity is protected';
 END IF;
 RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
"""
COMPOSITION_BODY = """
BEGIN
 IF NEW.procedimento_generico_id = TG_ARGV[0]::integer THEN
  RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'Historical neutral Generic cannot receive materials or phases';
 END IF;
 RETURN NEW;
END;
"""
TRIGGER_SPECS = {
    'brana_historical_neutral_identity': ('procedimento_generico', IDENTITY_FUNCTION, 27),
    'brana_historical_neutral_material': ('procedimento_generico_material', COMPOSITION_FUNCTION, 23),
    'brana_historical_neutral_phase': ('procedimento_generico_fase', COMPOSITION_FUNCTION, 23),
}


def installation_statements(generic_id):
    if type(generic_id) is not int or generic_id <= 0:
        raise ValueError('Generated historical sentinel PK required')
    functions = [f'CREATE FUNCTION public.{name}() RETURNS trigger LANGUAGE plpgsql AS $historical${body}$historical$'
                 for name, body in ((IDENTITY_FUNCTION, IDENTITY_BODY), (COMPOSITION_FUNCTION, COMPOSITION_BODY))]
    triggers = [f"CREATE TRIGGER {name} BEFORE {'UPDATE OR DELETE' if table == 'procedimento_generico' else 'INSERT OR UPDATE'} ON public.{table} FOR EACH ROW EXECUTE FUNCTION public.{function}('{generic_id}')"
                for name, (table, function, _) in TRIGGER_SPECS.items()]
    return functions + triggers


def review_historical_neutral_triggers(conn, triggers):
    if not triggers:
        return []
    if len(triggers) != 3 or {t['tgname'] for t in triggers} != set(TRIGGER_SPECS):
        raise ValueError('Unreviewed database writer trigger')
    values = [dict(r) for r in conn.execute(text("""
        SELECT t.tgname,c.relname AS table_name,n.nspname AS table_schema,
               t.tgtype,t.tgenabled,t.tgnargs,encode(t.tgargs,'hex') AS args_hex,
               t.tgconstraint,t.tgqual::text AS qualifier,p.proname AS function_name,
               pn.nspname AS function_schema,p.prosrc,p.prosecdef,p.proconfig,
               p.pronargs,p.provolatile,rt.typname AS result_type,l.lanname
        FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
        JOIN pg_namespace n ON n.oid=c.relnamespace JOIN pg_proc p ON p.oid=t.tgfoid
        JOIN pg_namespace pn ON pn.oid=p.pronamespace JOIN pg_language l ON l.oid=p.prolang
        JOIN pg_type rt ON rt.oid=p.prorettype
        WHERE n.nspname='public' AND NOT t.tgisinternal ORDER BY t.tgname
    """)).mappings()]
    if len(values) != 3:
        raise ValueError('Historical trigger set incomplete')
    gids = set()
    for v in values:
        table, function, tgtype = TRIGGER_SPECS[v['tgname']]
        body = IDENTITY_BODY if function == IDENTITY_FUNCTION else COMPOSITION_BODY
        if (v['table_name'] != table or v['table_schema'] != 'public'
                or v['function_schema'] != 'public' or v['function_name'] != function
                or v['tgtype'] != tgtype or v['tgenabled'] != 'O' or v['tgnargs'] != 1
                or v['tgconstraint'] != 0 or v['qualifier'] is not None
                or v['prosrc'] != body or v['prosecdef'] or v['proconfig'] is not None
                or v['pronargs'] != 0 or v['provolatile'] != 'v'
                or v['result_type'] != 'trigger' or v['lanname'] != 'plpgsql'):
            raise ValueError('Historical trigger/function definition altered')
        args = bytes.fromhex(v['args_hex'])
        if not args.endswith(b'\0') or not args[:-1].isdigit():
            raise ValueError('Historical trigger binding invalid')
        gids.add(int(args[:-1]))
    if len(gids) != 1:
        raise ValueError('Historical trigger bindings differ')
    gid = gids.pop()
    generic = conn.execute(text('SELECT id,clinica_id,codigo,descricao,inativo FROM procedimento_generico WHERE id=:id'), {'id': gid}).mappings().one_or_none()
    # This tenant restriction belongs to the reviewed historical migration only,
    # never to Generic bootstrap/default selection in the normal domain.
    if not generic or generic['clinica_id'] != 4 or generic['codigo'] != NEUTRAL_CODE or generic['descricao'] != NEUTRAL_NAME or generic['inativo']:
        raise ValueError('Historical sentinel identity changed')
    for table in ('procedimento_generico_material', 'procedimento_generico_fase'):
        if conn.execute(text(f'SELECT count(*) FROM {table} WHERE procedimento_generico_id=:id'), {'id': gid}).scalar_one():
            raise ValueError('Historical sentinel composition must be empty')
    by_name = {v['tgname']: v for v in values}
    return [{**t, 'neutral_generic_id': gid, 'neutral_clinic_id': generic['clinica_id'],
             'function_sha256': hashlib.sha256(by_name[t['tgname']]['prosrc'].encode()).hexdigest()}
            for t in sorted(triggers, key=lambda t: t['tgname'])]


def is_protected_historical_generic(db, item):
    if item.codigo != NEUTRAL_CODE or item.descricao != NEUTRAL_NAME:
        return False
    triggers = [dict(r) for r in db.execute(text("""
        SELECT c.relname AS table_name,t.tgname,pg_get_triggerdef(t.oid) AS definition
        FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid
        JOIN pg_namespace n ON n.oid=c.relnamespace
        WHERE n.nspname='public' AND NOT t.tgisinternal
    """)).mappings()]
    reviewed = review_historical_neutral_triggers(db, triggers)
    return bool(reviewed and reviewed[0]['neutral_generic_id'] == item.id
                and reviewed[0]['neutral_clinic_id'] == item.clinica_id)
