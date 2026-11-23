import { validClientReference } from './crm-clients.js';

export async function recordDeposit({method, sql, schema, data, reply, actor, dateOnly}) {
  if (method !== 'PATCH') return reply(405, {error:'method'});
  const {reference, revision, status, value_cents: cents, received_on: receivedOn} = data;
  if (!validClientReference(reference) || !Number.isInteger(revision) || revision < 1 || revision > 2147483647 ||
      !['pending','received'].includes(status) || !Number.isInteger(cents) || cents < 1 || cents > 2147483647 ||
      (status === 'received' ? !dateOnly(receivedOn) : receivedOn != null)) {
    return reply(400, {error:'invalid_deposit'});
  }
  const scope = actor.role === 'member' ? actor.id : null;
  const [result] = await sql.query(`
    WITH target AS (
      SELECT reference,revision,deposit_status,deposit_cents,deposit_received_on
      FROM ${schema}.opportunities WHERE reference=$1 AND ($2::uuid IS NULL OR owner_id=$2)
      FOR UPDATE
    ), checked AS (
      SELECT *, CASE
        WHEN $6::date > (now() AT TIME ZONE 'America/Sao_Paulo')::date THEN 'invalid_deposit_date'
        WHEN (deposit_status,deposit_cents,deposit_received_on) IS NOT DISTINCT FROM ($4::text,$5::integer,$6::date)
          THEN 'unchanged'
        WHEN revision<>$3 THEN 'stale'
      END AS state FROM target
    ), updated AS (
      UPDATE ${schema}.opportunities o SET deposit_status=$4,deposit_cents=$5,deposit_received_on=$6,
        deposit_updated_at=now(),updated_at=now(),revision=o.revision+1
      FROM checked c WHERE o.reference=c.reference AND c.state IS NULL
      RETURNING o.reference,o.revision,o.deposit_status,o.deposit_cents,o.deposit_received_on,o.deposit_updated_at
    ), audit AS (
      INSERT INTO ${schema}.deposit_events (reference,revision,actor_id,status,value_cents,received_on,occurred_at)
      SELECT reference,revision,$7,deposit_status,deposit_cents,deposit_received_on,deposit_updated_at FROM updated
    ) SELECT c.state,c.revision,(SELECT row_to_json(updated) FROM updated) AS deposit FROM checked c
  `, [reference,scope,revision,status,cents,receivedOn ?? null,actor.id]);
  if (!result) return reply(404, {error:'missing_contact'});
  if (result.state === 'stale') return reply(409, {error:'stale'});
  if (result.state === 'invalid_deposit_date') return reply(422, {error:result.state});
  return reply(200, {deposit:result.deposit, revision:result.deposit?.revision ?? result.revision});
}
