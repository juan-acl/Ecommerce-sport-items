#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$ROOT/tmp"
GEN="$ROOT/backend/tests/acceptance/generated"
STEPS_BASE="../steps"

mkdir -p "$TMP" "$GEN"

echo "=== Parsing feature files ==="
gherkin-parser "$ROOT/features/audit-advanced-search.feature"        "$TMP/audit-advanced-search.json"
gherkin-parser "$ROOT/features/order-status-email.feature"           "$TMP/order-status-email.json"
gherkin-parser "$ROOT/features/audit-api-params.feature"             "$TMP/audit-api-params.json"
gherkin-parser "$ROOT/features/audit-search-ui.feature"              "$TMP/audit-search-ui.json"
gherkin-parser "$ROOT/features/reports-purchases-api.feature"        "$TMP/reports-purchases-api.json"
gherkin-parser "$ROOT/features/reports-client-analytics-api.feature" "$TMP/reports-client-analytics-api.json"
gherkin-parser "$ROOT/features/reports-date-range-api.feature"       "$TMP/reports-date-range-api.json"
gherkin-parser "$ROOT/features/reports-purchases-ui.feature"         "$TMP/reports-purchases-ui.json"
gherkin-parser "$ROOT/features/reports-client-analytics-ui.feature"  "$TMP/reports-client-analytics-ui.json"

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

backend/node_modules/.bin/ts-node scripts/generate-acceptance.ts \
  "$TMP/reports-purchases-api.json" \
  "$GEN/reports-purchases-api.acceptance.test.ts" \
  "${STEPS_BASE}/reports-purchases-api.steps" \
  "registerReportsPurchasesApiSteps"

backend/node_modules/.bin/ts-node scripts/generate-acceptance.ts \
  "$TMP/reports-client-analytics-api.json" \
  "$GEN/reports-client-analytics-api.acceptance.test.ts" \
  "${STEPS_BASE}/reports-client-analytics-api.steps" \
  "registerReportsClientAnalyticsApiSteps"

backend/node_modules/.bin/ts-node scripts/generate-acceptance.ts \
  "$TMP/reports-date-range-api.json" \
  "$GEN/reports-date-range-api.acceptance.test.ts" \
  "${STEPS_BASE}/reports-date-range-api.steps" \
  "registerReportsDateRangeApiSteps"

backend/node_modules/.bin/ts-node scripts/generate-acceptance.ts \
  "$TMP/reports-purchases-ui.json" \
  "$GEN/reports-purchases-ui.acceptance.test.ts" \
  "${STEPS_BASE}/reports-purchases-ui.steps" \
  "registerReportsPurchasesUiSteps"

backend/node_modules/.bin/ts-node scripts/generate-acceptance.ts \
  "$TMP/reports-client-analytics-ui.json" \
  "$GEN/reports-client-analytics-ui.acceptance.test.ts" \
  "${STEPS_BASE}/reports-client-analytics-ui.steps" \
  "registerReportsClientAnalyticsUiSteps"

echo "=== Running acceptance tests ==="
cd "$ROOT/backend"
./node_modules/.bin/jest \
  tests/acceptance/generated/audit-advanced-search.acceptance.test.ts \
  tests/acceptance/generated/order-status-email.acceptance.test.ts \
  tests/acceptance/generated/audit-api-params.acceptance.test.ts \
  tests/acceptance/generated/audit-search-ui.acceptance.test.ts \
  tests/acceptance/generated/reports-purchases-api.acceptance.test.ts \
  tests/acceptance/generated/reports-client-analytics-api.acceptance.test.ts \
  tests/acceptance/generated/reports-date-range-api.acceptance.test.ts \
  tests/acceptance/generated/reports-purchases-ui.acceptance.test.ts \
  tests/acceptance/generated/reports-client-analytics-ui.acceptance.test.ts \
  --no-coverage
