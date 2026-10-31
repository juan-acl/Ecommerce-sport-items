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
