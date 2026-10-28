#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$ROOT/tmp"
GEN="$ROOT/backend/tests/acceptance/generated"
STEPS_BASE="../steps"

mkdir -p "$TMP" "$GEN"

echo "=== Parsing feature files ==="
gherkin-parser "$ROOT/features/audit-advanced-search.feature" "$TMP/audit-advanced-search.json"
gherkin-parser "$ROOT/features/order-status-email.feature"   "$TMP/order-status-email.json"
gherkin-parser "$ROOT/features/audit-api-params.feature"     "$TMP/audit-api-params.json"
gherkin-parser "$ROOT/features/audit-search-ui.feature"      "$TMP/audit-search-ui.json"

echo "=== Generating acceptance tests ==="
cd "$ROOT"
backend/node_modules/.bin/ts-node scripts/generate-acceptance.ts \
  "$TMP/audit-advanced-search.json" \
  "$GEN/audit-advanced-search.acceptance.test.ts" \
  "${STEPS_BASE}/audit-advanced-search.steps" \
  "registerAuditSteps"

backend/node_modules/.bin/ts-node scripts/generate-acceptance.ts \
  "$TMP/order-status-email.json" \
  "$GEN/order-status-email.acceptance.test.ts" \
  "${STEPS_BASE}/order-status-email.steps" \
  "registerOrderEmailSteps"

backend/node_modules/.bin/ts-node scripts/generate-acceptance.ts \
  "$TMP/audit-api-params.json" \
  "$GEN/audit-api-params.acceptance.test.ts" \
  "${STEPS_BASE}/audit-api-params.steps" \
  "registerAuditApiParamsSteps"

backend/node_modules/.bin/ts-node scripts/generate-acceptance.ts \
  "$TMP/audit-search-ui.json" \
  "$GEN/audit-search-ui.acceptance.test.ts" \
  "${STEPS_BASE}/audit-search-ui.steps" \
  "registerAuditSearchUiSteps"

echo "=== Running acceptance tests ==="
cd "$ROOT/backend"
./node_modules/.bin/jest \
  tests/acceptance/generated/audit-advanced-search.acceptance.test.ts \
  tests/acceptance/generated/order-status-email.acceptance.test.ts \
  tests/acceptance/generated/audit-api-params.acceptance.test.ts \
  tests/acceptance/generated/audit-search-ui.acceptance.test.ts \
  --no-coverage
