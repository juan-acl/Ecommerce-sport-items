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
