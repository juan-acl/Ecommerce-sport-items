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
