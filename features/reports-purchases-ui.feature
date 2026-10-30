# mutation-stamp: sha256=0b52a152716e8ae68886bf6ddc79e6fd291ae0943d5a6cc9f17945488237c149
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T00:32:18.302226Z","feature_name":"Reports Purchases UI","feature_path":"features/reports-purchases-ui.feature","background_hash":"961973a6702247835dfbe59c632297b1d10caa81d94d789fbb4287ea0540c5d2","implementation_hash":"unknown","scenarios":[{"index":9,"name":"Clicking a period button requests the purchases report for that period","scenario_hash":"04c4b531d6de8146aaf77df4653f00a1b09e26fbfd522dee2be2e88a4fa8cf7b","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:32:18.302226Z"},{"index":1,"name":"Compras tab shows a period filter button for each preset","scenario_hash":"94b592f87fbfe5deafdd0062932f88b653efc2615dd97dd866af951aadc091a4","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:32:13.078728Z"},{"index":2,"name":"Compras tab shows a summary stat card for each KPI","scenario_hash":"0875e544ef9785fa818ada1fc3937d6c2b3c6eba37005159f55527cbb3f6622a","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:32:13.078728Z"},{"index":4,"name":"Top proveedores table shows required columns","scenario_hash":"3523dafdbfa01fadd5f3be36bee264327889f4948fae8c2469a43fe14fb77ae8","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:32:13.078728Z"},{"index":6,"name":"Compras por estado table shows required columns","scenario_hash":"33db9eaad8e2b5bc8515cf63c6915e76ac045d454869724ba4f1d7f9349e58bd","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:32:13.078728Z"}]}
# acceptance-mutation-manifest-end

Feature: Reports Purchases UI

  Background:
    Given an admin is authenticated and viewing the Reportes page

  # Reports Purchases UI-1
  Scenario: Reports page shows a Compras tab
    Then the page displays a tab labeled "Compras"

  # Reports Purchases UI-2
  Scenario Outline: Compras tab shows a period filter button for each preset
    Given the admin has selected the "Compras" tab
    Then the tab displays a period button labeled "<label>"

    Examples:
      | label  |
      | Hoy    |
      | Semana |
      | Mes    |

  # Reports Purchases UI-3
  Scenario Outline: Compras tab shows a summary stat card for each KPI
    Given the admin has selected the "Compras" tab
    Then the tab displays a stat card labeled "<label>"

    Examples:
      | label          |
      | Total compras  |
      | Costo total    |
      | Costo promedio |

  # Reports Purchases UI-4
  Scenario: Compras tab shows a top suppliers table
    Given the admin has selected the "Compras" tab
    Then the tab displays a "Top proveedores" table

  # Reports Purchases UI-5
  Scenario Outline: Top proveedores table shows required columns
    Given the admin has selected the "Compras" tab
    Then the "Top proveedores" table has a column "<column>"

    Examples:
      | column      |
      | Proveedor   |
      | Compras     |
      | Gasto total |

  # Reports Purchases UI-6
  Scenario: Compras tab shows a purchases by status table
    Given the admin has selected the "Compras" tab
    Then the tab displays a "Compras por estado" table

  # Reports Purchases UI-7
  Scenario Outline: Compras por estado table shows required columns
    Given the admin has selected the "Compras" tab
    Then the "Compras por estado" table has a column "<column>"

    Examples:
      | column  |
      | Estado  |
      | Cantidad|

  # Reports Purchases UI-8
  Scenario: Top proveedores table has a CSV export button
    Given the admin has selected the "Compras" tab
    Then the "Top proveedores" table has a CSV export button

  # Reports Purchases UI-9
  Scenario: Compras por estado table has a CSV export button
    Given the admin has selected the "Compras" tab
    Then the "Compras por estado" table has a CSV export button

  # Reports Purchases UI-10
  Scenario Outline: Clicking a period button requests the purchases report for that period
    Given the admin has selected the "Compras" tab
    When the admin clicks the period button "<label>"
    Then the purchases report API is called with period "<period>"

    Examples:
      | label  | period |
      | Hoy    | day    |
      | Semana | week   |
      | Mes    | month  |
