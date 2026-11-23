# Security Specification — Agenda Escolar CETI Miguel Arcoverde

## Data Invariants
1. **Public Read-Only School Bulletin Board (No PII)**: `/events`, `/tasks`, `/schedule`, and `/meals` store strictly non-PII school calendar/curriculum records readable by all visitors so students see coordinator updates immediately.
2. **Verified Coordinator Writes Only**: Only authenticated, email-verified coordinators (`isAdmin()`) may create, update, or delete records in `/events`, `/tasks`, `/schedule`, and `/meals`.
3. **Immutable Ownership & Timestamps**: `authorUid` must match `request.auth.uid` on create and remain immutable on update; `createdAt`/`updatedAt` must equal `request.time`.
4. **Strict Key & Size Bounds**: Every document write validates exact allowed keys (`hasOnly`) and bounded string/array sizes to prevent shadow fields and resource exhaustion.
5. **No Self-Assigned Admin Escalation**: `/admins/{adminUid}` cannot be written by non-admin clients.

## Dirty Dozen Adversarial Payloads
1. Unauthenticated `create` on `/events/ev_1` -> `PERMISSION_DENIED`
2. Authenticated non-admin student `create` on `/events/ev_2` -> `PERMISSION_DENIED`
3. Unverified email (`email_verified == false`) admin spoof on `/events/ev_3` -> `PERMISSION_DENIED`
4. Shadow field injection (`isAdmin: true`) in `/events/ev_4` -> `PERMISSION_DENIED`
5. Identity spoofing (`authorUid != request.auth.uid`) in `/tasks/t_1` -> `PERMISSION_DENIED`
6. Forged client timestamp (`createdAt != request.time`) in `/events/ev_5` -> `PERMISSION_DENIED`
7. Oversized title (`title.size() > 160`) in `/events/ev_6` -> `PERMISSION_DENIED`
8. Malformed document ID (`../../bad`) -> `PERMISSION_DENIED`
9. Invalid category enum (`category: 'hacked'`) in `/events/ev_7` -> `PERMISSION_DENIED`
10. Unbounded allergens array (`allergens.size() > 10`) in `/meals/m_1` -> `PERMISSION_DENIED`
11. Self-promotion write to `/admins/{uid}` by student -> `PERMISSION_DENIED`
12. Mutating `createdAt` or `authorUid` during `update` on `/tasks/t_1` -> `PERMISSION_DENIED`
