# mutation-stamp: sha256=4333defca203912d4eff4d866a28fd2d364cfc354de702ca1f35bfab58572dcc
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-31T14:50:40.664452Z","feature_name":"Dashboard Charts UI","feature_path":"features/dashboard-charts-ui.feature","background_hash":"5abc4ba52797d7632df3b2778b7a98c9a68c8b78d7f88572efc115d791ff41e3","implementation_hash":"unknown","scenarios":[{"index":1,"name":"Dashboard trend period filter shows a button for each preset","scenario_hash":"f42a4bd44051d15b11ec60e9ff199d640544cda988aa4dedc00532dc39f1eeee","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-31T14:50:40.664452Z"},{"index":3,"name":"Clicking a trend period button updates the chart for that period","scenario_hash":"4dc9e45e21592857fc887f04da1ba44d7b5354792f798128b41dee7787243888","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-31T14:50:40.664452Z"}]}
# acceptance-mutation-manifest-end

Feature: Dashboard Charts UI

  Background:
    Given an admin is authenticated and viewing the Dashboard page

  # Dashboard Charts UI-1
  Scenario: Dashboard shows a period filter for the revenue trend chart
    Then the revenue trend section displays a period filter

  # Dashboard Charts UI-2
  Scenario Outline: Dashboard trend period filter shows a button for each preset
    Then the revenue trend section displays a period button labeled "<label>"

    Examples:
      | label  |
      | Hoy    |
      | Semana |
      | Mes    |

  # Dashboard Charts UI-3
  Scenario: Semana is the default selected period on the revenue trend chart
    Then the revenue trend period button "Semana" is active

  # Dashboard Charts UI-4
  Scenario Outline: Clicking a trend period button updates the chart for that period
    When the admin clicks the trend period button "<label>"
    Then the revenue trend chart is refreshed with period "<period>"

    Examples:
      | label  | period |
      | Hoy    | day    |
      | Semana | week   |
      | Mes    | month  |

  # Dashboard Charts UI-5
  Scenario: Dashboard shows a KPI summary row with at least four stat cards
    Then the dashboard displays at least 4 KPI stat cards

  # Dashboard Charts UI-6
  Scenario: Dashboard shows an orders pipeline chart section
    Then the dashboard displays a section titled "Pipeline de órdenes"

  # Dashboard Charts UI-7
  Scenario: Dashboard shows a top products chart section
    Then the dashboard displays a section titled "Productos más vendidos"

  # Dashboard Charts UI-8
  Scenario: Dashboard shows a revenue by category chart section
    Then the dashboard displays a section titled "Ingresos por categoría"
