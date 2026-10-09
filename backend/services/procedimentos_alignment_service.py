"""Explicit, manifest-gated alignment; never called from HTTP/bootstrap readers.

No database/env/application imports. The caller owns the connection, transaction,
backup, target acknowledgement and excluded tenant scope. Planning is read-only.
"""
from __future__ import annotations

import hashlib
import json
import copy
import re
from collections import Counter
from contextlib import contextmanager
from datetime import date, datetime

from sqlalchemy import text, event

ENTITY_TABLES = (
    'procedimento_tabela', 'procedimento_generico', 'simbolo_grafico_catalogo',
    'item_auxiliar', 'procedimento', 'procedimento_generico_material',
    'procedimento_generico_fase', 'procedimento_material', 'procedimento_fase',
)
VALID_BILLING = {'INTERVENCAO', 'INTERVENÇÃO', 'ELEMENTO_FACE', 'ELEMENTO/FACE',
                 'ELEMENTO / FACE', 'ELEMENTOFACE', 'ELEMENTO FACE'}
SCOPED_GUARD_VERSION = 'brana_procedimentos_scoped_guard_v1'
VOLATILE_FIELDS_EXCLUDED = ('usuarios.last_seen_at',)


class AlignmentBlocked(ValueError):
    pass


def serialized(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'),
                      default=lambda v: v.isoformat() if isinstance(v, (date, datetime)) else str(v))


def fingerprint(value):
    return hashlib.sha256(serialized(value).encode('utf-8')).hexdigest()


def rows(conn, sql, **params):
    return [dict(r) for r in conn.execute(text(sql), params).mappings()]


def identifier(name):
    # All identifiers come from PostgreSQL metadata or the explicit entity list.
    return '"' + name.replace('"', '""') + '"'


def capture_state(conn, clinic_ids):
    state = {}
    for cid in clinic_ids:
        data = {table: rows(conn, f'SELECT * FROM {identifier(table)} WHERE clinica_id=:cid ORDER BY id', cid=cid)
                for table in ENTITY_TABLES}
        data['clinica_config'] = rows(conn, 'SELECT id,nome_tabela_procedimentos FROM clinicas WHERE id=:cid', cid=cid)
        if len(data['clinica_config']) != 1:
            raise AlignmentBlocked(f'Unknown clinic: {cid}')
        state[str(cid)] = data
    return state


def tenant_hashes(conn, clinic_ids):
    columns = rows(conn, "SELECT table_name,column_name FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name,ordinal_position")
    tenant_tables = sorted({c['table_name'] for c in columns if c['column_name'] == 'clinica_id'})
    result = {}
    for cid in clinic_ids:
        values = {'clinicas': rows(conn, 'SELECT * FROM clinicas WHERE id=:cid', cid=cid)}
        for table in tenant_tables:
            values[table] = rows(conn, f'SELECT to_jsonb(t) AS row FROM {identifier(table)} t WHERE clinica_id=:cid ORDER BY to_jsonb(t)::text', cid=cid)
        # Persist only counts/hashes, never users' credentials or patient payloads.
        result[str(cid)] = {'hash': fingerprint(values), 'counts': {k: len(v) for k, v in values.items()}}
    return result


def scoped_fingerprint(snapshot):
    """R2 semantic contract: preserve values/schema; normalize row order only."""
    data = snapshot['data']
    specs = snapshot['specs']
    if set(data) != set(specs) or snapshot['contract'] != SCOPED_GUARD_VERSION:
        raise AlignmentBlocked('Scoped entity/version mismatch')
    normalized = {}
    for name, records in data.items():
        fields = set(specs[name]['fields'])
        if name.endswith('__historical_payloads'):
            fields = {f if f in ('id', 'clinica_id') else f + '__sha256' for f in fields}
        if any(set(r) != fields for r in records) or len({r['id'] for r in records}) != len(records):
            raise AlignmentBlocked('Scoped field/PK mismatch: ' + name)
        normalized[name] = sorted(records, key=lambda r: serialized(r['id']))
    return fingerprint({'contract': SCOPED_GUARD_VERSION,
                        'schema_sha256': snapshot['schema_sha256'], 'data': normalized})


def capture_exclusion_domain(conn, clinic_ids):
    """SELECT-only, schema-derived R2 scope; never includes presence timestamps.

    Core and relevant catalogs keep ALL columns, including audit timestamps.
    Private historical payloads keep complete value fingerprints, not plaintext.
    Unexpected schema/relations are captured and must match the before contract.
    """
    columns = rows(conn, "SELECT table_name,column_name,data_type,udt_name,is_nullable,column_default,ordinal_position FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name,ordinal_position")
    by_table = {}
    for col in columns:
        by_table.setdefault(col['table_name'], {})[col['column_name']] = col
    fks = rows(conn, "SELECT p.conname,c.relname AS table_name,a.attname AS column_name,cr.relname AS target,ar.attname AS target_column,p.confdeltype,p.confupdtype FROM pg_constraint p JOIN pg_class c ON c.oid=p.conrelid JOIN pg_class cr ON cr.oid=p.confrelid JOIN pg_namespace n ON n.oid=c.relnamespace JOIN LATERAL unnest(p.conkey,p.confkey) k(attnum,refnum) ON true JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum=k.attnum JOIN pg_attribute ar ON ar.attrelid=cr.oid AND ar.attnum=k.refnum WHERE p.contype='f' AND n.nspname='public' ORDER BY c.relname,p.conname,a.attname")
    constraints = rows(conn, "SELECT c.relname AS table_name,p.conname,pg_get_constraintdef(p.oid) AS definition FROM pg_constraint p JOIN pg_class c ON c.oid=p.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND p.contype IN ('c','u','p') ORDER BY c.relname,p.conname")
    triggers = rows(conn, "SELECT c.relname AS table_name,t.tgname,pg_get_triggerdef(t.oid) AS definition FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND NOT t.tgisinternal")
    if triggers:
        from services.historical_neutral_guard_service import review_historical_neutral_triggers
        try:
            triggers = review_historical_neutral_triggers(conn, triggers)
        except ValueError as error:
            raise AlignmentBlocked(str(error)) from error
    result = {}
    for cid in clinic_ids:
        data = {n: rows(conn, f'SELECT * FROM {identifier(n)} WHERE clinica_id=:cid ORDER BY id', cid=cid) for n in ENTITY_TABLES}
        data['clinica_config'] = rows(conn, 'SELECT id,nome_tabela_procedimentos,opcoes_sistema_json FROM clinicas WHERE id=:cid', cid=cid)
        if len(data['clinica_config']) != 1:
            raise AlignmentBlocked('Unknown scoped clinic')
        for n in ('lista_material', 'indice_financeiro', 'indice_cotacao'):
            data[n] = rows(conn, f'SELECT * FROM {identifier(n)} WHERE clinica_id=:cid ORDER BY id', cid=cid)
        data['material'] = rows(conn, 'SELECT m.* FROM material m JOIN lista_material l ON l.id=m.lista_id WHERE l.clinica_id=:cid ORDER BY m.id', cid=cid)
        data['tiss_tipo_tabela'] = rows(conn, 'SELECT * FROM tiss_tipo_tabela ORDER BY id')
        related = {r['table_name'] for r in fks if r['target'] in ENTITY_TABLES and r['table_name'] not in ENTITY_TABLES}
        related |= {n for n, cols in by_table.items() if n not in ENTITY_TABLES and any(f in cols for f in ('procedimento_id', 'procedimento_generico_id', 'procedimento_tabela_id'))}
        for n in sorted(related):
            if 'clinica_id' not in by_table[n]:
                raise AlignmentBlocked('Unreviewed non-tenant relation: ' + n)
            data[n] = rows(conn, f'SELECT * FROM {identifier(n)} WHERE clinica_id=:cid ORDER BY id', cid=cid)
        specs = {}
        for n in data:
            table = 'clinicas' if n == 'clinica_config' else n
            fields = ['id', 'nome_tabela_procedimentos', 'opcoes_sistema_json'] if n == 'clinica_config' else list(by_table[n])
            specs[n] = {'table': table, 'fields': sorted(fields)}
        for n, cols in by_table.items():
            if 'clinica_id' not in cols:
                continue
            if n not in data and 'tabela_codigo' in cols:
                fields = ['id', 'clinica_id', 'tabela_codigo'] + (['indice'] if 'indice' in cols else [])
                name = n + '__procedure_links'
                specs[name] = {'table': n, 'fields': sorted(fields)}
                data[name] = rows(conn, f'SELECT {",".join(identifier(f) for f in fields)} FROM {identifier(n)} WHERE clinica_id=:cid ORDER BY id', cid=cid)
            if any(t in n for t in ('paciente', 'tratamento', 'orcamento', 'historico', 'lancamento', 'odontograma', 'auditoria', 'usuario')):
                fields = [f for f, col in cols.items() if col['data_type'] in ('json', 'jsonb') or 'json' in f or f == 'source_payload']
                if fields:
                    name = n + '__historical_payloads'
                    specs[name] = {'table': n, 'fields': sorted(['id', 'clinica_id', *fields])}
                    values = rows(conn, f'SELECT id,clinica_id,{",".join(identifier(f) for f in fields)} FROM {identifier(n)} WHERE clinica_id=:cid ORDER BY id', cid=cid)
                    data[name] = [{'id': r['id'], 'clinica_id': r['clinica_id'], **{f+'__sha256': fingerprint(r[f]) for f in fields}} for r in values]
        schema = {n: [{k: by_table[s['table']][f][k] for k in ('column_name', 'data_type', 'udt_name', 'is_nullable', 'column_default')} for f in s['fields']] for n, s in specs.items()}
        selected_fks = [r for r in fks if any(s['table'] == r['table_name'] and r['column_name'] in s['fields'] for s in specs.values())]
        selected_constraints = [r for r in constraints if r['table_name'] in {s['table'] for s in specs.values()}]
        scoped_triggers = [t for t in triggers if t['neutral_clinic_id'] == cid]
        schema_hash = fingerprint({'fields': schema, 'fks': selected_fks, 'constraints': selected_constraints, 'triggers': scoped_triggers})
        base_schema_hash = fingerprint({'fields': schema, 'fks': selected_fks, 'constraints': selected_constraints, 'triggers': []})
        snapshot = {'contract': SCOPED_GUARD_VERSION, 'schema_sha256': schema_hash,
                    'base_schema_sha256': base_schema_hash, 'data': data, 'specs': specs}
        # Fail closed for an uncovered cross-tenant edge rather than silently
        # hashing only the tenant side of an invalid shared relationship.
        for fk in fks:
            if fk['target'] not in ENTITY_TABLES or 'clinica_id' not in by_table[fk['table_name']]:
                continue
            sql = f'SELECT count(*) FROM {identifier(fk["table_name"])} r JOIN {identifier(fk["target"])} p ON p.{identifier(fk["target_column"])}=r.{identifier(fk["column_name"])} WHERE (r.clinica_id=:cid OR p.clinica_id=:cid) AND r.clinica_id<>p.clinica_id'
            if conn.execute(text(sql), {'cid': cid}).scalar_one():
                raise AlignmentBlocked('Cross-tenant scoped reference')
        mids = {m['id'] for m in data['material']}
        if any(r['material_id'] not in mids for n in ('procedimento_material', 'procedimento_generico_material') for r in data[n]):
            raise AlignmentBlocked('Unresolved/cross-tenant scoped material')
        snapshot['hash'] = scoped_fingerprint(snapshot)
        snapshot['counts'] = {n: len(rs) for n, rs in data.items()}
        result[str(cid)] = snapshot
    return result


def scoped_hashes(snapshots):
    return {cid: {'contract': s['contract'], 'schema_sha256': s['schema_sha256'],
                  'hash': scoped_fingerprint(s), 'counts': s['counts']} for cid, s in snapshots.items()}


def assert_exclusions_unchanged(before, after):
    if scoped_hashes(before) != scoped_hashes(after):
        raise AlignmentBlocked('Excluded clinic scoped domain changed')


def assert_expected_target_diff(before, after, plans):
    """Exact expected rows, not merely allowed field names/counts."""
    if set(before) != set(after) or set(before) != {str(p['clinic_id']) for p in plans}:
        raise AlignmentBlocked('Unexpected target scope')
    for plan in plans:
        cid = str(plan['clinic_id']); b = before[cid]; a = after[cid]
        if b['schema_sha256'] != a['schema_sha256'] or b['specs'] != a['specs']:
            raise AlignmentBlocked('Target scoped schema changed')
        expected = copy.deepcopy(b['data'])
        generics = {}
        for table in ('procedimento_generico', 'simbolo_grafico_catalogo'):
            original = {r['id']: r for r in expected[table]}
            new = [r for r in a['data'][table] if r['id'] not in original]
            ops = [o for o in plan['catalog_creates'] if o['table'] == table]
            if len(new) != len(ops):
                raise AlignmentBlocked('Unexpected catalog additions')
            for op in ops:
                payload = op['payload']
                matches = [r for r in new if r['codigo'] == payload['codigo'] and (table != 'simbolo_grafico_catalogo' or r['legacy_id'] == payload['legacy_id'])]
                if len(matches) != 1:
                    raise AlignmentBlocked('New catalog identity ambiguous')
                row = matches[0]
                for f, v in row.items():
                    if f == 'id':
                        if not isinstance(v, int) or v <= 0:
                            raise AlignmentBlocked('Invalid generated catalog PK')
                    elif f in payload:
                        if v != payload[f]:
                            raise AlignmentBlocked('Unexpected catalog payload value')
                    elif v is not None:
                        raise AlignmentBlocked('Unproven new catalog default: ' + f)
                expected[table].append(row)
        generics = {r['codigo']: r['id'] for r in expected['procedimento_generico']}
        by_id = {r['id']: r for r in expected['procedimento']}
        for op in plan['procedure_updates']:
            changes = dict(op['changes'])
            if 'procedimento_generico_codigo' in changes:
                changes['procedimento_generico_id'] = generics[changes.pop('procedimento_generico_codigo')]
            by_id[op['id']].update(changes)
        expected['procedimento'] = [r for r in expected['procedimento'] if r['id'] not in plan['extra_ids']]
        expected['procedimento_tabela'] = [r for r in expected['procedimento_tabela'] if r['id'] not in plan['extra_table_ids']]
        candidate = {**b, 'data': expected}
        if scoped_fingerprint(candidate) != scoped_fingerprint(a):
            raise AlignmentBlocked('Unexpected target diff outside approved plan')


@contextmanager
def alignment_write_barrier(conn, plans, protected_ids):
    """Positive exact-SQL/bind allowlist; rejects no-op and raw driver writes too."""
    targets = {p['clinic_id'] for p in plans}
    if targets.intersection(protected_ids) or len(targets) != len(plans):
        raise AlignmentBlocked('Protected/duplicate write scope')
    permitted = {}
    for plan in plans:
        cid = plan['clinic_id']
        for op in plan['catalog_creates']:
            payload = op['payload']; fields = list(payload)
            if op['table'] not in ('procedimento_generico', 'simbolo_grafico_catalogo') or payload['clinica_id'] != cid:
                raise AlignmentBlocked('Unapproved catalog write')
            sql = f'INSERT INTO {identifier(op["table"])} ({",".join(identifier(f) for f in fields)}) VALUES ({",".join(":"+f for f in fields)}) RETURNING id'
            permitted.setdefault(sql, []).append(dict(payload))
        for op in plan['procedure_updates']:
            changes = dict(op['changes'])
            if set(changes) - {'nome', 'procedimento_generico_codigo', 'especialidade', 'simbolo_grafico', 'simbolo_grafico_legacy_id', 'forma_cobranca'}:
                raise AlignmentBlocked('Non-required field in write plan')
            generic_code = changes.pop('procedimento_generico_codigo', None)
            if generic_code is not None:
                # Deferred literal resolver: the approved new catalog may not
                # exist until preceding INSERTs in this same transaction.
                changes['procedimento_generico_id'] = ('GENERIC', cid, generic_code)
            sql = f'UPDATE procedimento SET {",".join(identifier(k)+"=:"+k for k in changes)} WHERE id=:id AND clinica_id=:cid'
            permitted.setdefault(sql, []).append({**changes, 'id': op['id'], 'cid': cid})
        for table, key in (('procedimento', 'extra_ids'), ('procedimento_tabela', 'extra_table_ids')):
            if plan[key]:
                permitted.setdefault(f'DELETE FROM {table} WHERE clinica_id=:cid AND id=ANY(:ids)', []).append({'cid': cid, 'ids': plan[key]})
    generic_ids = {}
    def guard(connection, cursor, statement, parameters, context, executemany):
        # The operator emits single, comment-free statements. Do not let an
        # approved SELECT prefix conceal a second command or a comment bypass.
        if any(token in statement for token in (';', '--', '/*', '*/')):
            raise AlignmentBlocked('Multiple/commented SQL outside alignment contract')
        first = statement.lstrip().split()[0].upper()
        if first in ('SELECT', 'SHOW') or statement.strip().upper() == 'SET TRANSACTION READ ONLY':
            if first == 'SELECT' and re.search(r'\binto\b', statement, re.IGNORECASE):
                raise AlignmentBlocked('SELECT INTO write outside alignment contract')
            if re.search(r'"[^"]+"\s*\(|\b[a-zA-Z_]\w*\s*\.\s*[a-zA-Z_]\w*\s*\(', statement):
                raise AlignmentBlocked('Quoted/qualified function outside alignment contract')
            # No opaque side-effect functions may hide behind SELECT.
            functions = set(re.findall(r'\b([a-zA-Z_]\w*)\s*\(', statement.lower()))
            safe = {'count', 'any', 'in', 'where', 'coalesce', 'cast', 'to_jsonb', 'unnest', 'k', 'pg_get_constraintdef', 'pg_get_triggerdef', 'pg_advisory_xact_lock', 'current_setting', 'now', 'pg_current_snapshot', 'and', 'or'}
            if functions - safe:
                raise AlignmentBlocked('Opaque SELECT function outside alignment contract')
            return
        original = str(context.compiled.statement) if context.compiled is not None else ''
        if executemany or original not in permitted or len(context.compiled_parameters) != 1:
            raise AlignmentBlocked('SQL write outside approved alignment manifest')
        bound = context.compiled_parameters[0]
        for expected in permitted[original]:
            if any(k in expected and bound.get(k) != expected[k] for k in ('id', 'cid', 'clinica_id')):
                continue
            resolved = dict(expected)
            for k, v in expected.items():
                if isinstance(v, tuple) and v[0] == 'GENERIC':
                    if v not in generic_ids:
                        ids = rows(connection, 'SELECT id FROM procedimento_generico WHERE clinica_id=:cid AND codigo=:code', cid=v[1], code=v[2])
                        if len(ids) != 1:
                            raise AlignmentBlocked('Manifest generic literal unresolved')
                        generic_ids[v] = ids[0]['id']
                    resolved[k] = generic_ids[v]
            if bound == resolved:
                return
        raise AlignmentBlocked('SQL binds outside approved alignment manifest')
    event.listen(conn, 'before_cursor_execute', guard)
    try:
        yield
    finally:
        event.remove(conn, 'before_cursor_execute', guard)


def execute_guarded_alignment(conn, bundle, plans, scoped_before, replan, *, internal_batch=False):
    """Real operator transaction body, also exercised by the owned harness.

    Caller MUST own the transaction and rollback on AlignmentBlocked. A fresh
    read-only connection checks concurrent excluded-domain mutations; an RR
    snapshot alone would not see a writer in another session before commit.
    """
    target_ids = [p['clinic_id'] for p in plans]
    approved = bundle['approved_clinics']
    if (not target_ids or len(set(target_ids)) != len(target_ids)
            or any(type(cid) is not int or cid not in approved for cid in target_ids)
            or set(target_ids).intersection(bundle['protected_clinics'])
            or (len(target_ids) != 1 and not internal_batch)
            or (internal_batch and sorted(target_ids) != approved)):
        raise AlignmentBlocked('Unexpected guarded operator target scope')
    all_ids = sorted(set([*bundle['protected_clinics'], *approved]))
    if set(scoped_before) != {str(cid) for cid in all_ids}:
        raise AlignmentBlocked('Incomplete all-clinic scoped baseline')
    # Serializes operator transactions only; 0 is a lock key, never a tenant.
    conn.execute(text('SELECT pg_advisory_xact_lock(:namespace,:cid)'), {'namespace': 73126, 'cid': 0})
    # All non-current clinics are protected, not just ID1/ID4. Batch is an
    # explicit internal regression path, never a productive CLI option.
    excluded_ids = [cid for cid in all_ids if cid not in target_ids]
    current = capture_exclusion_domain(conn, all_ids)
    assert_exclusions_unchanged(scoped_before, current)
    excluded_before = {str(cid): scoped_before[str(cid)] for cid in excluded_ids}
    target_before = {str(cid): scoped_before[str(cid)] for cid in target_ids}
    with alignment_write_barrier(conn, plans, excluded_ids):
        results = [execute_clinic_plan(conn, p, bundle['canonical'], authorized=True) for p in plans]
        first_after = capture_state(conn, target_ids)
        scoped_after = capture_exclusion_domain(conn, [*excluded_ids, *target_ids])
        assert_exclusions_unchanged(excluded_before, {str(cid): scoped_after[str(cid)] for cid in excluded_ids})
        assert_expected_target_diff(target_before, {str(cid): scoped_after[str(cid)] for cid in target_ids}, plans)
        _, second_plans = replan(conn, bundle, target_ids)
        if any(p['catalog_creates'] or p['procedure_updates'] or p['extra_ids'] or p['extra_table_ids'] for p in second_plans):
            raise AlignmentBlocked('Second passage is not a zero-change plan')
        # Empty plans install an empty write allowlist: even a no-op DML fails.
        with alignment_write_barrier(conn, second_plans, excluded_ids):
            second = [execute_clinic_plan(conn, p, bundle['canonical'], authorized=True) for p in second_plans]
        assert_exclusions_unchanged(scoped_after, capture_exclusion_domain(conn, [*excluded_ids, *target_ids]))
        with conn.engine.connect() as fresh:
            with fresh.begin():
                fresh.execute(text('SET TRANSACTION READ ONLY'))
                assert_exclusions_unchanged(excluded_before, capture_exclusion_domain(fresh, excluded_ids))
    return results, first_after, second, scoped_after


def dependency_audit(conn, cid, extra_ids, extra_table_ids):
    fks = rows(conn, "SELECT c.relname AS table_name,a.attname AS column_name,cr.relname AS target FROM pg_constraint p JOIN pg_class c ON c.oid=p.conrelid JOIN pg_class cr ON cr.oid=p.confrelid JOIN pg_namespace n ON n.oid=c.relnamespace JOIN LATERAL unnest(p.conkey) AS k(attnum) ON true JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum=k.attnum WHERE p.contype='f' AND n.nspname='public' AND cr.relname IN ('procedimento','procedimento_tabela')")
    columns = rows(conn, "SELECT table_name,column_name,data_type FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name,column_name")
    by_table = {}
    for c in columns:
        by_table.setdefault(c['table_name'], {})[c['column_name']] = c['data_type']
    candidates = {(r['table_name'], r['column_name'], r['target']) for r in fks}
    for table, cols in by_table.items():
        for col in cols:
            if col == 'procedimento_id':
                candidates.add((table, col, 'procedimento'))
            if col == 'procedimento_tabela_id':
                candidates.add((table, col, 'procedimento_tabela'))
    found = []
    for table, col, target in sorted(candidates):
        ids = extra_ids if target == 'procedimento' else extra_table_ids
        if not ids:
            continue
        count = conn.execute(text(f'SELECT count(*) FROM {identifier(table)} WHERE {identifier(col)}=ANY(:ids)'), {'ids': ids}).scalar_one()
        if count:
            found.append({'table': table, 'column': col, 'count': count})
    for table, cols in by_table.items():
        if 'clinica_id' not in cols:
            continue
        if 'tabela_codigo' in cols and extra_table_ids:
            count = conn.execute(text(f'SELECT count(*) FROM {identifier(table)} WHERE clinica_id=:cid AND tabela_codigo=4'), {'cid': cid}).scalar_one()
            if count:
                found.append({'table': table, 'column': 'tabela_codigo', 'count': count})
        if not any(x in table for x in ('paciente', 'tratamento', 'orcamento', 'historico', 'lancamento', 'odontograma', 'auditoria', 'usuario')):
            continue
        for col, kind in cols.items():
            if kind not in ('json', 'jsonb') and 'json' not in col and col != 'source_payload':
                continue
            for record in rows(conn, f'SELECT {identifier(col)} AS payload FROM {identifier(table)} WHERE clinica_id=:cid AND {identifier(col)} IS NOT NULL', cid=cid):
                payload = record['payload']
                if isinstance(payload, str):
                    try:
                        payload = json.loads(payload)
                    except ValueError:
                        raise AlignmentBlocked(f'Unparsed historical payload: {table}.{col}')
                def walk(value):
                    if isinstance(value, dict):
                        for key, v in value.items():
                            name = str(key).lower()
                            if isinstance(v, (str, int)) and str(v).isdigit():
                                num = int(v)
                                if ('procedimento' in name and num in extra_ids) or ('tabela' in name and (num in extra_table_ids or num == 4)):
                                    found.append({'table': table, 'column': col, 'key': name, 'count': 1})
                            walk(v)
                    elif isinstance(value, list):
                        for v in value:
                            walk(v)
                walk(payload)
    return {'references_to_extras': found, 'count': sum(r['count'] for r in found)}


def symbol_valid(proc, symbols):
    code, legacy = proc.get('simbolo_grafico'), proc.get('simbolo_grafico_legacy_id')
    if not code and not legacy:
        return False
    matches = [s for s in symbols if s['ativo'] and (not code or s['codigo'] == code)
               and (not legacy or s['legacy_id'] == legacy)]
    return len(matches) == 1


def reference_integrity(conn, cid):
    counts = {'clinical': 0, 'financial': 0, 'historical': 0, 'material': 0, 'phase': 0, 'table': 0, 'generic': 0}
    for category, sql in (
        ('table', 'SELECT count(*) FROM procedimento p LEFT JOIN procedimento_tabela t ON t.id=p.tabela_id AND t.clinica_id=p.clinica_id WHERE p.clinica_id=:cid AND t.id IS NULL'),
        ('generic', 'SELECT count(*) FROM procedimento p LEFT JOIN procedimento_generico g ON g.id=p.procedimento_generico_id AND g.clinica_id=p.clinica_id WHERE p.clinica_id=:cid AND p.procedimento_generico_id IS NOT NULL AND g.id IS NULL'),
        ('material', 'SELECT count(*) FROM procedimento_material r LEFT JOIN procedimento p ON p.id=r.procedimento_id AND p.clinica_id=r.clinica_id WHERE r.clinica_id=:cid AND p.id IS NULL'),
        ('phase', 'SELECT count(*) FROM procedimento_fase r LEFT JOIN procedimento p ON p.id=r.procedimento_id AND p.clinica_id=r.clinica_id WHERE r.clinica_id=:cid AND p.id IS NULL'),
    ):
        counts[category] += conn.execute(text(sql), {'cid': cid}).scalar_one()
    metadata = rows(conn, "SELECT table_name,column_name FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name,column_name")
    columns = {}
    for c in metadata:
        columns.setdefault(c['table_name'], set()).add(c['column_name'])
    for table, cols in columns.items():
        if table in ('procedimento_material', 'procedimento_fase') or 'clinica_id' not in cols:
            continue
        if 'procedimento_id' in cols:
            count = conn.execute(text(f'SELECT count(*) FROM {identifier(table)} r LEFT JOIN procedimento p ON p.id=r.procedimento_id AND p.clinica_id=r.clinica_id WHERE r.clinica_id=:cid AND r.procedimento_id IS NOT NULL AND p.id IS NULL'), {'cid': cid}).scalar_one()
            category = 'financial' if 'lancamento' in table or 'financeir' in table else 'historical' if 'histor' in table or 'auditoria' in table else 'clinical'
            counts[category] += count
        if 'tabela_codigo' in cols:
            counts['table'] += conn.execute(text(f'SELECT count(*) FROM {identifier(table)} r LEFT JOIN procedimento_tabela t ON t.codigo=r.tabela_codigo AND t.clinica_id=r.clinica_id WHERE r.clinica_id=:cid AND r.tabela_codigo IS NOT NULL AND t.id IS NULL'), {'cid': cid}).scalar_one()
    return {'counts': counts, 'total': sum(counts.values())}


def specialty_key(value):
    value = str(value or '').strip()
    if value.isdigit():
        number = int(value)
        return f'{number:02d}' if number > 0 else ''
    return value[:20]


def required_changes(proc, seed, generics, specialties, symbols):
    changes = {}
    if not str(proc.get('nome') or '').strip():
        changes['nome'] = seed['nome']
    if proc.get('procedimento_generico_id') not in {g['id'] for g in generics}:
        changes['procedimento_generico_codigo'] = seed['procedimento_generico_codigo']
    specialty = specialty_key(proc.get('especialidade'))
    if specialty not in specialties:
        changes['especialidade'] = seed['especialidade']
    if not symbol_valid(proc, symbols):
        changes['simbolo_grafico'] = seed['simbolo_grafico']
        changes['simbolo_grafico_legacy_id'] = seed['simbolo_grafico_legacy_id']
    if str(proc.get('forma_cobranca') or '').strip().upper() not in VALID_BILLING:
        changes['forma_cobranca'] = seed['forma_cobranca']
    return changes


def build_clinic_plan(data, canonical, catalog_plan, reviewed_extras, expected_extra_rows):
    config = data['clinica_config'][0]
    cid = config['id']
    tables = {t['codigo']: t for t in data['procedimento_tabela']}
    if len(tables) != len(data['procedimento_tabela']):
        raise AlignmentBlocked('Duplicate table code')
    standard_codes = {t['codigo'] for t in canonical['tables']}
    if set(tables) not in (standard_codes, standard_codes | {4}):
        raise AlignmentBlocked(f'Unexpected/missing table identity: {cid}')
    extras = [p for p in data['procedimento'] if 4 in tables and p['tabela_id'] == tables[4]['id']]
    if 4 in tables:
        if tables[4]['nome'] != 'Brana' or len(extras) != 336:
            raise AlignmentBlocked(f'Unexpected extra table state: {cid}')
        expected = {p['id']: p for p in expected_extra_rows}
        if {p['id'] for p in extras} != set(expected):
            raise AlignmentBlocked('Extra PK set differs from reviewed manifest')
        for p in extras:
            if fingerprint(p) != fingerprint(expected[p['id']]):
                raise AlignmentBlocked(f'Changed extra fingerprint: {p["id"]}')
        for table in ('procedimento_material', 'procedimento_fase'):
            if any(r['procedimento_id'] in expected for r in data[table]):
                raise AlignmentBlocked('Own extra relationship must survive; no approximate remap')
    elif len(data['procedimento']) != 1263:
        raise AlignmentBlocked('Unexpected post-alignment procedure inventory')
    generics = data['procedimento_generico']
    if len({g['codigo'] for g in generics}) != len(generics):
        raise AlignmentBlocked('Ambiguous generic literal identity')
    symbols = data['simbolo_grafico_catalogo']
    if len({(s['legacy_id'], s['codigo']) for s in symbols}) != len(symbols):
        raise AlignmentBlocked('Ambiguous symbol identity')
    specialties = {specialty_key(s['codigo']) for s in data['item_auxiliar']
                   if str(s['tipo']).lower() == 'especialidade' and not s.get('inativo') and str(s.get('descricao') or '').strip()}
    creates = []
    for op in catalog_plan['generic_catalog_operations']:
        if not any(g['codigo'] == op['code'] for g in generics):
            if op['materials'] or op['phases'] or op['confidence'] != 'EXACT':
                raise AlignmentBlocked('Catalog operation outside exact neutral seven-generics contract')
            creates.append({'table': 'procedimento_generico', 'payload': {'clinica_id': cid, **op['payload'],
                'tempo': 0, 'custo_lab': 0, 'peso': 0, 'mostrar_simbolo': False, 'inativo': False}})
    for op in catalog_plan['symbol_catalog_operations']:
        if not any(s['legacy_id'] == op['legacy_id'] for s in symbols):
            creates.append({'table': 'simbolo_grafico_catalogo', 'payload': {'clinica_id': cid, **op['payload']}})
    procedure_by_key = {(p['tabela_id'], p['codigo']): p for p in data['procedimento']}
    if len(procedure_by_key) != len(data['procedimento']):
        raise AlignmentBlocked('Duplicate procedure key')
    updates, selected = [], []
    for table in canonical['tables']:
        actual_table = tables[table['codigo']]
        actual_codes = {p['codigo'] for p in data['procedimento'] if p['tabela_id'] == actual_table['id']}
        if actual_codes != {p['codigo'] for p in table['procedimentos']}:
            raise AlignmentBlocked('Canonical procedure key set changed; review before removal')
        for seed in table['procedimentos']:
            if seed['especialidade'] not in specialties:
                raise AlignmentBlocked('Canonical specialty unavailable')
            available_generics = {g['codigo'] for g in generics} | {c['payload']['codigo'] for c in creates if c['table'] == 'procedimento_generico'}
            available_symbols = {(s['legacy_id'], s['codigo']) for s in symbols if s['ativo']} | {
                (c['payload']['legacy_id'], c['payload']['codigo']) for c in creates if c['table'] == 'simbolo_grafico_catalogo'}
            if seed['procedimento_generico_codigo'] not in available_generics or (seed['simbolo_grafico_legacy_id'], seed['simbolo_grafico']) not in available_symbols:
                raise AlignmentBlocked('Canonical tenant catalog reference unresolved')
            p = procedure_by_key[(actual_table['id'], seed['codigo'])]
            selected.append(p['id'])
            change = required_changes(p, seed, generics, specialties, symbols)
            if change:
                updates.append({'id': p['id'], 'changes': change})
    if set(selected) | {p['id'] for p in extras} != {p['id'] for p in data['procedimento']}:
        raise AlignmentBlocked('Orphan/unmanifested procedure; no broad removal allowed')
    old_protected = {p['procedure_id'] for p in reviewed_extras if p['was_protected_in_r2a']}
    return {'clinic_id': cid, 'before_hash': fingerprint(data), 'catalog_creates': creates,
            'procedure_updates': updates, 'extra_ids': sorted(p['id'] for p in extras),
            'extra_table_ids': [tables[4]['id']] if extras else [],
            'protected_extras_removed': len(old_protected.intersection(p['id'] for p in extras)),
            'expected_table_count': 9, 'expected_procedure_count': 1263,
            'config_updates': 0, 'data_migrations': 0}


def validate_final(data, canonical):
    dummy = {'generic_catalog_operations': [], 'symbol_catalog_operations': []}
    plan = build_clinic_plan(data, canonical, dummy, [], [])
    if plan['catalog_creates'] or plan['procedure_updates'] or plan['extra_ids']:
        raise AlignmentBlocked('Final state is incomplete or still contains extras')
    return {'table_count': len(data['procedimento_tabela']), 'procedure_count': len(data['procedimento']),
            'complete': 1263, 'incomplete': 0, 'extra_tables': 0, 'extra_procedures': 0}


def insert_row(conn, table, payload):
    # Explicit column list retains database-generated IDs/defaults for new rows.
    fields = list(payload)
    return conn.execute(text(f'INSERT INTO {identifier(table)} ({",".join(identifier(f) for f in fields)}) VALUES ({",".join(":"+f for f in fields)}) RETURNING id'), payload).scalar_one()


def execute_clinic_plan(conn, plan, canonical, *, authorized=False):
    if not authorized:
        raise AlignmentBlocked('Explicit apply authorization required')
    cid = plan['clinic_id']
    conn.execute(text('SELECT pg_advisory_xact_lock(:namespace,:cid)'), {'namespace': 73126, 'cid': cid})
    # Lock all relevant tenant rows until the caller's commit/rollback.
    for table in ('clinicas', *ENTITY_TABLES):
        col = 'id' if table == 'clinicas' else 'clinica_id'
        conn.execute(text(f'SELECT id FROM {identifier(table)} WHERE {col}=:cid FOR UPDATE'), {'cid': cid}).all()
    before = capture_state(conn, [cid])[str(cid)]
    if fingerprint(before) != plan['before_hash']:
        raise AlignmentBlocked('Concurrent change since preflight')
    audit = dependency_audit(conn, cid, plan['extra_ids'], plan['extra_table_ids'])
    if audit['count']:
        raise AlignmentBlocked('Extra reference discovered before first DML')
    changes = Counter()
    for op in plan['catalog_creates']:
        insert_row(conn, op['table'], op['payload'])
        changes['catalog_rows_created'] += 1
    generics = {r['codigo']: r for r in rows(conn, 'SELECT * FROM procedimento_generico WHERE clinica_id=:cid', cid=cid)}
    for op in plan['procedure_updates']:
        fields = dict(op['changes'])
        if 'procedimento_generico_codigo' in fields:
            generic = generics[fields.pop('procedimento_generico_codigo')]
            # A newly assigned generic replaces phases. In this manifest the
            # neutral catalogs have no phases; never silently discard own phases.
            own_phases = conn.execute(text('SELECT count(*) FROM procedimento_fase WHERE procedimento_id=:id'), {'id': op['id']}).scalar_one()
            generic_phases = conn.execute(text('SELECT count(*) FROM procedimento_generico_fase WHERE procedimento_generico_id=:id'), {'id': generic['id']}).scalar_one()
            if own_phases or generic_phases:
                raise AlignmentBlocked('Unexpected phase association needs separate proven migration')
            fields['procedimento_generico_id'] = generic['id']
        sql = f'UPDATE procedimento SET {",".join(identifier(k)+"=:"+k for k in fields)} WHERE id=:id AND clinica_id=:cid'
        result = conn.execute(text(sql), {**fields, 'id': op['id'], 'cid': cid})
        if result.rowcount != 1:
            raise AlignmentBlocked('Procedure update cardinality mismatch')
        changes['procedures_updated'] += 1
        changes['required_values_updated'] += len(fields)
    # Required canonical invariant MUST hold before the first removal.
    filled = capture_state(conn, [cid])[str(cid)]
    standard = {**filled, 'procedimento_tabela': [t for t in filled['procedimento_tabela'] if t['id'] not in plan['extra_table_ids']],
                'procedimento': [p for p in filled['procedimento'] if p['id'] not in plan['extra_ids']]}
    validate_final(standard, canonical)
    if plan['extra_ids']:
        result = conn.execute(text('DELETE FROM procedimento WHERE clinica_id=:cid AND id=ANY(:ids)'), {'cid': cid, 'ids': plan['extra_ids']})
        if result.rowcount != len(plan['extra_ids']):
            raise AlignmentBlocked('Extra delete cardinality mismatch')
        changes['procedures_removed'] += result.rowcount
    if plan['extra_table_ids']:
        result = conn.execute(text('DELETE FROM procedimento_tabela WHERE clinica_id=:cid AND id=ANY(:ids)'), {'cid': cid, 'ids': plan['extra_table_ids']})
        if result.rowcount != len(plan['extra_table_ids']):
            raise AlignmentBlocked('Extra table delete cardinality mismatch')
        changes['tables_removed'] += result.rowcount
    after = capture_state(conn, [cid])[str(cid)]
    final = validate_final(after, canonical)
    integrity = reference_integrity(conn, cid)
    if integrity['total']:
        raise AlignmentBlocked('Dangling reference found; caller must rollback')
    old_symbols = {s['id']: s for s in before['simbolo_grafico_catalogo']}
    if any(fingerprint(s) != fingerprint(old_symbols[s['id']]) for s in after['simbolo_grafico_catalogo'] if s['id'] in old_symbols):
        raise AlignmentBlocked('Existing symbol catalog changed')
    if not set(old_symbols).issubset(s['id'] for s in after['simbolo_grafico_catalogo']):
        raise AlignmentBlocked('Symbol identity removed')
    old_generics = {g['id']: g for g in before['procedimento_generico']}
    if not set(old_generics).issubset(g['id'] for g in after['procedimento_generico']):
        raise AlignmentBlocked('Existing generic removed')
    if any(fingerprint(g) != fingerprint(old_generics[g['id']]) for g in after['procedimento_generico'] if g['id'] in old_generics):
        raise AlignmentBlocked('Existing generic catalog changed')
    changed = {op['id']: set(op['changes']) | ({'procedimento_generico_id'} if 'procedimento_generico_codigo' in op['changes'] else set()) for op in plan['procedure_updates']}
    old_p = {p['id']: p for p in before['procedimento']}
    for p in after['procedimento']:
        for key in p:
            if key not in changed.get(p['id'], set()) and p[key] != old_p[p['id']][key]:
                raise AlignmentBlocked(f'Unplanned optional/valid field overwrite: {p["id"]}/{key}')
    for table in ('procedimento_material', 'procedimento_fase', 'procedimento_generico_material', 'procedimento_generico_fase', 'item_auxiliar', 'clinica_config'):
        if fingerprint(before[table]) != fingerprint(after[table]):
            raise AlignmentBlocked('Unplanned relation/config/catalog change')
    return {'clinic_id': cid, **final, 'operations': dict(changes), 'protected_extras_removed': plan['protected_extras_removed'],
            'symbol_catalog_preserved': True, 'dangling_references': integrity['total'], 'reference_integrity': integrity,
            'before_hash': plan['before_hash'], 'after_hash': fingerprint(after)}


def restore_clinic_backup(conn, backup, post_hash, *, authorized=False):
    """Guarded rollback, tested only in disposable clones before production apply."""
    if not authorized:
        raise AlignmentBlocked('Explicit rollback authorization required')
    cid = backup['clinica_config'][0]['id']
    current = capture_state(conn, [cid])[str(cid)]
    if fingerprint(current) != post_hash:
        raise AlignmentBlocked('Post-state changed; no blind rollback overwrite')
    for table in ('procedimento_tabela', 'procedimento'):
        existing = {r['id']: r for r in current[table]}
        for row in backup[table]:
            if row['id'] not in existing:
                insert_row(conn, table, row)
            elif fingerprint(row) != fingerprint(existing[row['id']]):
                changed = {k: v for k, v in row.items() if k != 'id' and v != existing[row['id']][k]}
                conn.execute(text(f'UPDATE {identifier(table)} SET {",".join(identifier(k)+"=:"+k for k in changed)} WHERE id=:id AND clinica_id=:scope'), {**changed, 'id': row['id'], 'scope': cid})
    for table in ('procedimento_generico', 'simbolo_grafico_catalogo'):
        original = {r['id'] for r in backup[table]}
        added = [r['id'] for r in current[table] if r['id'] not in original]
        if added:
            conn.execute(text(f'DELETE FROM {identifier(table)} WHERE clinica_id=:cid AND id=ANY(:ids)'), {'cid': cid, 'ids': added})
    restored = capture_state(conn, [cid])[str(cid)]
    if fingerprint(restored) != fingerprint(backup):
        raise AlignmentBlocked('Rollback fingerprint mismatch')
    return {'clinic_id': cid, 'restored_exactly': True, 'restored_hash': fingerprint(restored), 'sequences_rewound': False}
