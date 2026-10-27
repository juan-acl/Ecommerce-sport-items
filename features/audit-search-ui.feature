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
  Scenario Outline: Selecting a single filter sends it to the API
    When the admin sets the "<filter>" filter to "<value>"
    Then the audit API is called with parameter "<filter>" equal to "<value>"
    And the results table shows only matching records

    Examples:
      | filter     | value                  |
      | action     | ORDER_APPROVED         |
      | action     | ORDER_STATUS_CHANGED   |
      | entityType | order                  |
      | entityType | product                |
      | userEmail  | admin@example.com      |

  # Audit Search UI-3
  Scenario: Setting a date range sends fromDate and toDate to the API
    When the admin sets "fromDate" to "2026-10-01" and "toDate" to "2026-10-31"
    Then the audit API is called with fromDate "2026-10-01" and toDate "2026-10-31"

  # Audit Search UI-4
  Scenario: Combining filters sends all active params to the API
    When the admin sets the "action" filter to "ORDER_APPROVED"
    And the admin sets the "entityType" filter to "order"
    And the admin sets "fromDate" to "2026-10-01" and "toDate" to "2026-10-31"
    Then the audit API is called with parameters action "ORDER_APPROVED", entityType "order", fromDate "2026-10-01", toDate "2026-10-31"

  # Audit Search UI-5
  Scenario: Changing a filter resets pagination to the first page
    Given audit results are showing a second page
    When the admin sets the "action" filter to "PRODUCT_UPDATED"
    Then the API is called without a cursor parameter

  # Audit Search UI-6
  Scenario: Clearing all filters restores the unfiltered view
    Given the admin has active filters set
    When the admin clicks the clear filters button
    Then the audit API is called with no filter parameters
    And the results table shows all records
