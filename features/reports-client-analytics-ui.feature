# mutation-stamp: sha256=dbba60614af8cc975634d604f9f545f0953612efd0ce74a4f6bb1cd8c433f957
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T00:34:41.653791Z","feature_name":"Reports Client Analytics UI","feature_path":"features/reports-client-analytics-ui.feature","background_hash":"961973a6702247835dfbe59c632297b1d10caa81d94d789fbb4287ea0540c5d2","implementation_hash":"unknown","scenarios":[{"index":6,"name":"Clicking a period button requests the client analytics report for that period","scenario_hash":"afb01fe425472564aec44464ce71c8b5dcd5c0a6b1cc903da75a4a6398f9f06d","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:41.653791Z"},{"index":1,"name":"Clientes tab shows a period filter button for each preset","scenario_hash":"ed3650b3cb4cec40b0879c651d61fd978711224f3595c2b9b7ebeef454650ed8","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:37.911762Z"},{"index":2,"name":"Clientes tab shows a summary stat card for each KPI","scenario_hash":"8057e008aa6c160d46d4ac9e1357e652cb7595d6ca25af8313fd2dc85ea6a7b5","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:37.911762Z"},{"index":4,"name":"Top clientes table shows required columns","scenario_hash":"93337f0313836e2456252c594e335fb6bd58dbc2147e4e8950a39c096cdb4a64","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:37.911762Z"}]}
# acceptance-mutation-manifest-end

Feature: Reports Client Analytics UI

  Background:
    Given an admin is authenticated and viewing the Reportes page

  # Reports Client Analytics UI-1
  Scenario: Reports page shows a Clientes tab
    Then the page displays a tab labeled "Clientes"

  # Reports Client Analytics UI-2
  Scenario Outline: Clientes tab shows a period filter button for each preset
    Given the admin has selected the "Clientes" tab
    Then the tab displays a period button labeled "<label>"

    Examples:
      | label  |
      | Hoy    |
      | Semana |
      | Mes    |

  # Reports Client Analytics UI-3
  Scenario Outline: Clientes tab shows a summary stat card for each KPI
    Given the admin has selected the "Clientes" tab
    Then the tab displays a stat card labeled "<label>"

    Examples:
      | label           |
      | Total clientes  |
      | Nuevos clientes |

  # Reports Client Analytics UI-4
  Scenario: Clientes tab shows a top clients table
    Given the admin has selected the "Clientes" tab
    Then the tab displays a "Top clientes" table

  # Reports Client Analytics UI-5
  Scenario Outline: Top clientes table shows required columns
    Given the admin has selected the "Clientes" tab
    Then the "Top clientes" table has a column "<column>"

    Examples:
      | column        |
      | Cliente       |
      | Órdenes       |
      | Gasto total   |

  # Reports Client Analytics UI-6
  Scenario: Top clientes table has a CSV export button
    Given the admin has selected the "Clientes" tab
    Then the "Top clientes" table has a CSV export button

  # Reports Client Analytics UI-7
  Scenario Outline: Clicking a period button requests the client analytics report for that period
    Given the admin has selected the "Clientes" tab
    When the admin clicks the period button "<label>"
    Then the client analytics report API is called with period "<period>"

    Examples:
      | label  | period |
      | Hoy    | day    |
      | Semana | week   |
      | Mes    | month  |
