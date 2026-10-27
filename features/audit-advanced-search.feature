Feature: Audit Advanced Search

  Background:
    Given the user is authenticated as an admin with permission "audit:view"
    And the following audit logs exist:
      | action                 | userId  | entityType | entityId | createdAt            |
      | ORDER_APPROVED         | user-1  | order      | ord-1    | 2026-10-01T10:00:00Z |
      | ORDER_REJECTED         | user-1  | order      | ord-2    | 2026-10-01T11:00:00Z |
      | ORDER_STATUS_CHANGED   | user-2  | order      | ord-3    | 2026-10-02T09:00:00Z |
      | PRODUCT_UPDATED        | user-2  | product    | prd-1    | 2026-10-02T15:00:00Z |
      | ORDER_STATUS_CHANGED   | user-3  | order      | ord-4    | 2026-10-03T08:00:00Z |

  # Audit Advanced Search-1
  Scenario Outline: Filter audit logs by action
    When the admin requests audit logs with filter action "<action>"
    Then the response contains only logs with action "<action>"

    Examples:
      | action               |
      | ORDER_APPROVED       |
      | ORDER_REJECTED       |
      | ORDER_STATUS_CHANGED |
      | PRODUCT_UPDATED      |

  # Audit Advanced Search-2
  Scenario Outline: Filter audit logs by userId
    When the admin requests audit logs with filter userId "<userId>"
    Then the response contains only logs with userId "<userId>"

    Examples:
      | userId |
      | user-1 |
      | user-2 |
      | user-3 |

  # Audit Advanced Search-3
  Scenario Outline: Filter audit logs by date range
    When the admin requests audit logs from "<from>" to "<to>"
    Then the response contains only logs created between "<from>" and "<to>"

    Examples:
      | from                 | to                   |
      | 2026-10-01T00:00:00Z | 2026-10-01T23:59:59Z |
      | 2026-10-02T00:00:00Z | 2026-10-02T23:59:59Z |
      | 2026-10-01T00:00:00Z | 2026-10-03T23:59:59Z |

  # Audit Advanced Search-4
  Scenario Outline: Filter audit logs by action and date range combined
    When the admin requests audit logs with filter action "<action>" from "<from>" to "<to>"
    Then the response contains only logs with action "<action>" created between "<from>" and "<to>"

    Examples:
      | action               | from                 | to                   |
      | ORDER_STATUS_CHANGED | 2026-10-02T00:00:00Z | 2026-10-03T23:59:59Z |
      | ORDER_APPROVED       | 2026-10-01T00:00:00Z | 2026-10-01T23:59:59Z |

  # Audit Advanced Search-5
  Scenario: No audit logs match the filter returns empty list
    When the admin requests audit logs with filter action "NONEXISTENT_ACTION"
    Then the response contains an empty list of audit logs

  # Audit Advanced Search-6
  Scenario Outline: Filter audit logs by entityType
    When the admin requests audit logs with filter entityType "<entityType>"
    Then the response contains only logs with entityType "<entityType>"

    Examples:
      | entityType |
      | order      |
      | product    |

  # Audit Advanced Search-7
  Scenario Outline: Filter audit logs by userEmail
    When the admin requests audit logs with filter userEmail "<userEmail>"
    Then the response contains only logs with userEmail "<userEmail>"

    Examples:
      | userEmail             |
      | admin@example.com     |
      | operator@example.com  |

  # Audit Advanced Search-8
  Scenario Outline: Pagination applies when filtering by action
    Given there are "<total>" audit logs with action "ORDER_STATUS_CHANGED"
    When the admin requests audit logs with filter action "ORDER_STATUS_CHANGED" and limit "<limit>"
    Then the response contains at most "<limit>" logs
    And the response includes a cursor when more results exist

    Examples:
      | total | limit |
      | 5     | 2     |
      | 3     | 3     |
      | 1     | 5     |
