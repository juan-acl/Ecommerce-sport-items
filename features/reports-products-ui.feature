# mutation-stamp: sha256=fc9539ba6438e8045e518e328e6d5927048fec60b722c5918a889628a791d531
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T21:24:04.686122Z","feature_name":"Reports Products UI","feature_path":"features/reports-products-ui.feature","background_hash":"961973a6702247835dfbe59c632297b1d10caa81d94d789fbb4287ea0540c5d2","implementation_hash":"unknown","scenarios":[{"index":7,"name":"Selecting a stock status filter requests the products report with that status","scenario_hash":"62398acf4265ffedc607edacb04e6e1f30b025d68a133b3d949810760a4245f8","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:24:04.686122Z"},{"index":1,"name":"Productos tab shows a filter control for each filterable field","scenario_hash":"9ade8877c6dd2404333d0969105a5fc3869403ec6d87ac2159182d277c57b359","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:23:10.798750Z"},{"index":2,"name":"Productos tab shows required table columns","scenario_hash":"f064974227179212d3b8dfc6b6ff5f28f6bbd2946158a9291dcd87e5f0c06229","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:23:10.798750Z"}]}
# acceptance-mutation-manifest-end

Feature: Reports Products UI

  Background:
    Given an admin is authenticated and viewing the Reportes page

  # Reports Products UI-1
  Scenario: Reports page shows a Productos tab
    Then the page displays a tab labeled "Productos"

  # Reports Products UI-2
  Scenario Outline: Productos tab shows a filter control for each filterable field
    Given the admin has selected the "Productos" tab
    Then the tab displays a filter control for "<field>"

    Examples:
      | field       |
      | category    |
      | name        |
      | stockStatus |

  # Reports Products UI-3
  Scenario Outline: Productos tab shows required table columns
    Given the admin has selected the "Productos" tab
    Then the products table has a column "<column>"

    Examples:
      | column    |
      | Producto  |
      | Categoría |
      | Precio    |
      | Stock     |
      | Mínimo    |
      | Estado    |

  # Reports Products UI-4
  Scenario: Productos tab shows total product count
    Given the admin has selected the "Productos" tab
    Then the tab displays a stat card labeled "Total productos"

  # Reports Products UI-5
  Scenario: Products table has a CSV export button
    Given the admin has selected the "Productos" tab
    Then the products table has a CSV export button

  # Reports Products UI-6
  Scenario: Selecting a category filter requests the products report with that category
    Given the admin has selected the "Productos" tab
    When the admin selects category "running" in the category filter
    Then the products report API is called with category "running"

  # Reports Products UI-7
  Scenario: Typing in the name filter requests the products report with that name
    Given the admin has selected the "Productos" tab
    When the admin types "camisa" in the name filter
    Then the products report API is called with name "camisa"

  # Reports Products UI-8
  Scenario Outline: Selecting a stock status filter requests the products report with that status
    Given the admin has selected the "Productos" tab
    When the admin selects stockStatus "<status>" in the stock filter
    Then the products report API is called with stockStatus "<status>"

    Examples:
      | status       |
      | out_of_stock |
      | low_stock    |
      | in_stock     |
