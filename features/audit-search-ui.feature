Feature: Audit Search UI

  Background:
    Given an admin is authenticated and viewing the Auditoría page

  # Audit Search UI-1
  Scenario Outline: Filter panel shows a control for each searchable field
    Then the page displays a filter control for "<field>"

    Examples:
      | field      |
      | action     |
      | entityType |
      | userEmail  |
      | fromDate   |
      | toDate     |

  # Audit Search UI-2
  Scenario: Filter panel shows a search button
    Then the page displays a "Buscar" button

  # Audit Search UI-3
  Scenario Outline: Changing a filter value does not trigger a new API call
    When the admin sets the "<filter>" filter to "<value>"
    Then the audit API is not called

    Examples:
      | filter     | value                |
      | action     | ORDER_APPROVED       |
      | entityType | order                |
      | userEmail  | admin@example.com    |

  # Audit Search UI-4
  Scenario: Setting a date range does not trigger a new API call
    When the admin sets "fromDate" to "2026-10-01" and "toDate" to "2026-10-31"
    Then the audit API is not called

  # Audit Search UI-5
  Scenario Outline: Clicking Buscar sends all active filters to the API
    Given the admin has set the "<filter>" filter to "<value>"
    When the admin clicks the "Buscar" button
    Then the audit API is called with parameter "<filter>" equal to "<value>"
    And the results table shows only matching records

    Examples:
      | filter     | value                  |
      | action     | ORDER_APPROVED         |
      | action     | ORDER_STATUS_CHANGED   |
      | entityType | order                  |
      | entityType | product                |
      | userEmail  | admin@example.com      |

  # Audit Search UI-6
  Scenario: Clicking Buscar with a date range sends fromDate and toDate to the API
    Given the admin has set "fromDate" to "2026-10-01" and "toDate" to "2026-10-31"
    When the admin clicks the "Buscar" button
    Then the audit API is called with fromDate "2026-10-01" and toDate "2026-10-31"

  # Audit Search UI-7
  Scenario: Clicking Buscar with multiple filters sends all active params
    Given the admin has set the "action" filter to "ORDER_APPROVED"
    And the admin has set the "entityType" filter to "order"
    And the admin has set "fromDate" to "2026-10-01" and "toDate" to "2026-10-31"
    When the admin clicks the "Buscar" button
    Then the audit API is called with parameters action "ORDER_APPROVED", entityType "order", fromDate "2026-10-01", toDate "2026-10-31"

  # Audit Search UI-8
  Scenario: Clicking Buscar resets pagination to the first page
    Given audit results are showing a second page
    When the admin clicks the "Buscar" button
    Then the API is called without a cursor parameter

  # Audit Search UI-9
  Scenario: Clearing filters resets all values and immediately searches without filters
    Given the admin has active filters set
    When the admin clicks the clear filters button
    Then the audit API is called with no filter parameters
    And the results table shows all records
