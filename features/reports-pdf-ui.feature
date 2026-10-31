# mutation-stamp: sha256=457d913fb6a0a13c00bcfa7fc8338fd7edcb522310ec2cae60a6f5691666c89d
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-31T19:03:45.014810Z","feature_name":"Reports PDF Export UI","feature_path":"features/reports-pdf-ui.feature","background_hash":"961973a6702247835dfbe59c632297b1d10caa81d94d789fbb4287ea0540c5d2","implementation_hash":"unknown","scenarios":[{"index":0,"name":"Compras tab tables have PDF export buttons","scenario_hash":"2f72d1d86272d74c4397efd66859615c049717c04b5a181d23a2a050958552a9","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-31T19:03:45.014810Z"},{"index":3,"name":"Chart report tabs have a PDF export button","scenario_hash":"d69137068d2a8f8de762c6e05aa58d7b0da148305cefffabdbc9e97301977ac6","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-31T19:03:45.014810Z"}]}
# acceptance-mutation-manifest-end

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
