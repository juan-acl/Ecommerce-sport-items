Feature: Reports Date Range API

  Background:
    Given the admin API client is initialized

  # Reports Date Range API-1
  Scenario Outline: Sales report with explicit date range scopes totalOrders to that window
    When the client requests the sales report with from "<from>" and to "<to>"
    Then the response "totalOrders" counts only orders created from "<from>" to "<to>"

    Examples:
      | from       | to         |
      | 2026-01-01 | 2026-03-31 |
      | 2026-07-01 | 2026-09-30 |

  # Reports Date Range API-2
  Scenario: Sales report explicit date range takes precedence over period parameter
    When the client requests the sales report with period "day" and from "2026-10-01" and to "2026-10-31"
    Then the response "totalOrders" counts only orders created from "2026-10-01" to "2026-10-31"

  # Reports Date Range API-3
  Scenario Outline: Purchases report with explicit date range scopes totalPurchases to that window
    When the client requests the purchases report with from "<from>" and to "<to>"
    Then the response "totalPurchases" counts only purchases created from "<from>" to "<to>"

    Examples:
      | from       | to         |
      | 2026-01-01 | 2026-03-31 |
      | 2026-07-01 | 2026-09-30 |

  # Reports Date Range API-4
  Scenario: Purchases report explicit date range takes precedence over period parameter
    When the client requests the purchases report with period "day" and from "2026-10-01" and to "2026-10-31"
    Then the response "totalPurchases" counts only purchases created from "2026-10-01" to "2026-10-31"

  # Reports Date Range API-5
  Scenario Outline: Client analytics report with explicit date range scopes newClients to that window
    When the client requests the client analytics report with from "<from>" and to "<to>"
    Then the response "newClients" counts only clients registered from "<from>" to "<to>"

    Examples:
      | from       | to         |
      | 2026-01-01 | 2026-03-31 |
      | 2026-07-01 | 2026-09-30 |
