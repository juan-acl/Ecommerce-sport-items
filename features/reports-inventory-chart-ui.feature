# mutation-stamp: sha256=50c59838fe41cd99361ad70d0e400eb5fe846ffaf1da5541fdeb727dd7b99e7f
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-31T14:50:47.585952Z","feature_name":"Reports Inventory Chart UI","feature_path":"features/reports-inventory-chart-ui.feature","background_hash":"a304ddad91751ba366e33184f870c0c59e0e91516a2d92d6d1c692266556b255","implementation_hash":"unknown","scenarios":[{"index":1,"name":"Stock distribution chart shows a bar for each stock status","scenario_hash":"d432d5b66501ed7c03b6c34fe1b286c7d4aa64faf34d5c50ba4154cda233dcbf","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-31T14:50:47.585952Z"}]}
# acceptance-mutation-manifest-end

Feature: Reports Inventory Chart UI

  Background:
    Given an admin is authenticated and viewing the Reportes page
    And the admin has selected the "Inventario" tab

  # Reports Inventory Chart UI-1
  Scenario: Inventario tab shows a stock status distribution chart section
    Then the tab displays a chart section titled "Distribución de stock"

  # Reports Inventory Chart UI-2
  Scenario Outline: Stock distribution chart shows a bar for each stock status
    Then the "Distribución de stock" chart displays a bar labeled "<label>"

    Examples:
      | label      |
      | En stock   |
      | Stock bajo |
      | Sin stock  |
