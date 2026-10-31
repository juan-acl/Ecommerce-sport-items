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
