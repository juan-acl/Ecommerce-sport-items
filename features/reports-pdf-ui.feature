Feature: Reports PDF Export UI

  Background:
    Given an admin is authenticated and viewing the Reportes page

  # Reports PDF Export UI-1
  Scenario Outline: Compras tab tables have PDF export buttons
    Given the admin has selected the "Compras" tab
    Then the "<table>" table has a PDF export button

    Examples:
      | table              |
      | Top proveedores    |
      | Compras por estado |

  # Reports PDF Export UI-2
  Scenario: Products table has a PDF export button
    Given the admin has selected the "Productos" tab
    Then the products table has a PDF export button

  # Reports PDF Export UI-3
  Scenario: Top clientes table has a PDF export button
    Given the admin has selected the "Clientes" tab
    Then the "Top clientes" table has a PDF export button

  # Reports PDF Export UI-4
  Scenario Outline: Chart report tabs have a PDF export button
    Given the admin has selected the "<tab>" tab
    Then the tab displays a PDF export button

    Examples:
      | tab        |
      | Ventas     |
      | Inventario |
