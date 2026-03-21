/**
 * BridgePoint AI — Agent Seed Script
 *
 * Seeds the 19 BridgePoint AI manufacturing agent templates into the database.
 * Run after db:migrate and after at least one user has signed in.
 *
 * Usage:
 *   DATABASE_URL=postgresql://postgres:bridgepoint_dev_2026@localhost:5432/lobechat \
 *     bun run scripts/seed-agents.ts
 *
 * What it does:
 *   1. Connects to the database directly via pg
 *   2. Finds the first user (or uses USER_ID env var)
 *   3. For each agent: creates an agents row, a sessions row, and links them
 *   4. Skips agents that already exist (matched by clientId)
 *
 * To re-seed (replace existing): pass --force
 */

import fs from 'node:fs';
import path from 'node:path';

import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is required');
  console.error('Usage: DATABASE_URL=postgresql://... bun run scripts/seed-agents.ts');
  process.exit(1);
}

const force = process.argv.includes('--force');

// ---------- helpers ----------

function nanoId(size = 12): string {
  const alphabet = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < size; i++) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

const agentId = () => `agt_${nanoId()}`;
const sessionId = () => `ssn_${nanoId()}`;
const randomSlug = () => `bp-${nanoId(4)}-${nanoId(4)}`.toLowerCase();

// ---------- load seed data ----------

const seedPath = path.join(import.meta.dir, 'seed-agents.json');
const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

interface SeedSession {
  config: {
    model: string;
    provider: string;
    systemRole: string;
    params: Record<string, number>;
    chatConfig: Record<string, unknown>;
    plugins: string[];
    openingMessage: string;
    openingQuestions: string[];
    tts: Record<string, unknown>;
  };
  id: string;
  meta: {
    title: string;
    description: string;
    avatar: string;
    tags: string[];
  };
  pinned: boolean;
  type: string;
}

// ---------- main ----------

async function main() {
  const client = new pg.Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log('Connected to database');

  try {
    // Find user
    const userId = process.env.USER_ID;
    let targetUserId: string;

    if (userId) {
      targetUserId = userId;
      console.log(`Using provided USER_ID: ${targetUserId}`);
    } else {
      const res = await client.query('SELECT id FROM users ORDER BY created_at ASC LIMIT 1');
      if (res.rows.length === 0) {
        console.error('ERROR: No users found in database. Sign in at least once first.');
        process.exit(1);
      }
      targetUserId = res.rows[0].id;
      console.log(`Using first user: ${targetUserId}`);
    }

    const sessions: SeedSession[] = seedData.sessions;
    let created = 0;
    let skipped = 0;

    for (const session of sessions) {
      const clientIdValue = session.id; // e.g. "bp-support-assistant"

      // Check if agent already exists for this user
      const existing = await client.query(
        'SELECT id FROM agents WHERE client_id = $1 AND user_id = $2',
        [clientIdValue, targetUserId],
      );

      if (existing.rows.length > 0 && !force) {
        console.log(`  SKIP: ${session.meta.title} (already exists)`);
        skipped++;
        continue;
      }

      if (existing.rows.length > 0 && force) {
        // Delete existing agent (cascades to agents_to_sessions)
        await client.query('DELETE FROM agents WHERE client_id = $1 AND user_id = $2', [
          clientIdValue,
          targetUserId,
        ]);
        console.log(`  Removed existing: ${session.meta.title}`);
      }

      // Create agent
      const agtId = agentId();
      const ssnId = sessionId();
      const slug = randomSlug();
      const ssnSlug = randomSlug();
      const now = new Date();

      await client.query('BEGIN');

      try {
        // Insert agent
        await client.query(
          `INSERT INTO agents (
            id, slug, title, description, tags, avatar, background_color,
            client_id, user_id, model, provider, system_role,
            params, chat_config, plugins, tts,
            opening_message, opening_questions, pinned,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12,
            $13, $14, $15, $16,
            $17, $18, $19,
            $20, $21
          )`,
          [
            agtId,
            slug,
            session.meta.title,
            session.meta.description,
            JSON.stringify(session.meta.tags),
            session.meta.avatar,
            null, // backgroundColor
            clientIdValue,
            targetUserId,
            session.config.model,
            session.config.provider,
            session.config.systemRole,
            JSON.stringify(session.config.params),
            JSON.stringify(session.config.chatConfig),
            JSON.stringify(session.config.plugins),
            JSON.stringify(session.config.tts),
            session.config.openingMessage,
            session.config.openingQuestions,
            session.pinned,
            now,
            now,
          ],
        );

        // Insert session
        await client.query(
          `INSERT INTO sessions (
            id, slug, title, description, avatar, background_color,
            type, user_id, pinned, client_id,
            created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10,
            $11, $12
          )`,
          [
            ssnId,
            ssnSlug,
            session.meta.title,
            session.meta.description,
            session.meta.avatar,
            null,
            'agent',
            targetUserId,
            session.pinned,
            `${clientIdValue}-session`,
            now,
            now,
          ],
        );

        // Link agent to session
        await client.query(
          `INSERT INTO agents_to_sessions (agent_id, session_id, user_id)
           VALUES ($1, $2, $3)`,
          [agtId, ssnId, targetUserId],
        );

        await client.query('COMMIT');
        console.log(`  CREATED: ${session.meta.title} (agent: ${agtId}, session: ${ssnId})`);
        created++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`  ERROR creating ${session.meta.title}:`, err);
        throw err;
      }
    }

    console.log(`\nDone: ${created} created, ${skipped} skipped`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
