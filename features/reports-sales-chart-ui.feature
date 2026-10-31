# mutation-stamp: sha256=3b2c6d375e0a10c49c4e05709d63a67b943b4db0149e64ef113b992537308c38
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-31T14:50:58.648077Z","feature_name":"Reports Sales Chart UI","feature_path":"features/reports-sales-chart-ui.feature","background_hash":"107154542d5edec454d2ed1889ed24563f700683ed8d6f86fe456d8ff2419e75","implementation_hash":"unknown","scenarios":[{"index":1,"name":"Ventas tab revenue trend chart refreshes for each period","scenario_hash":"c9ad1c5fcfd6d108f816a9894fbd52694de3ee5be41854c66e4ec8902a002b45","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-31T14:50:58.648077Z"},{"index":3,"name":"Orders-by-status chart shows a bar for each status","scenario_hash":"c1a9b74ba333409a02a095c1cb579afbef3cbce352cdea33d51edeb85cd997e2","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-31T14:50:58.648077Z"}]}
# acceptance-mutation-manifest-end

Feature: Reports Sales Chart UI

  Background:
    Given an admin is authenticated and viewing the Reportes page
    And the admin has selected the "Ventas" tab

  # Reports Sales Chart UI-1
  Scenario: Ventas tab shows a revenue trend chart section
    Then the tab displays a chart section titled "Tendencia de ingresos"

  # Reports Sales Chart UI-2
  Scenario Outline: Ventas tab revenue trend chart refreshes for each period
    When the admin clicks the period button "<label>"
    Then the revenue trend chart displays bars for period "<period>"

    Examples:
      | label  | period |
      | Hoy    | day    |
      | Semana | week   |
      | Mes    | month  |

  # Reports Sales Chart UI-3
  Scenario: Ventas tab shows an orders-by-status chart section
    Then the tab displays a chart section titled "Distribución por estado"

  # Reports Sales Chart UI-4
  Scenario Outline: Orders-by-status chart shows a bar for each status
    Then the "Distribución por estado" chart displays a bar labeled "<status>"

    Examples:
      | status     |
      | Confirmado |
      | Cancelado  |
