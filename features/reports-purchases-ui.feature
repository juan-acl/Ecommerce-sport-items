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
  Scenario: Top proveedores table has a CSV export button
    Given the admin has selected the "Compras" tab
    Then the "Top proveedores" table has a CSV export button

  # Reports Purchases UI-8
  Scenario Outline: Clicking a period button requests the purchases report for that period
    Given the admin has selected the "Compras" tab
    When the admin clicks the period button "<label>"
    Then the purchases report API is called with period "<period>"

    Examples:
      | label  | period |
      | Hoy    | day    |
      | Semana | week   |
      | Mes    | month  |
