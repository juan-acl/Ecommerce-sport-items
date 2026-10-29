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
