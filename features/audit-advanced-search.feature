# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-27T02:21:51.119914Z","feature_name":"Audit Advanced Search","feature_path":"features/audit-advanced-search.feature","background_hash":"87a799a3d3703598092abd533e8a40fc3df5a5963643f722487769a2714d4dae","implementation_hash":"unknown","scenarios":[{"index":2,"name":"Filter audit logs by date range","scenario_hash":"c7d4b7528c4ee0c3cc138b975388521e0c948e6b7efcc803d0df5d9d05449f76","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-27T02:21:51.119914Z"},{"index":3,"name":"Filter audit logs by action and date range combined","scenario_hash":"7deaeab6b74ccdad102dcd4339b52c071937c990e37881fe63a762781af8f36b","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-27T02:21:51.119914Z"},{"index":1,"name":"Filter audit logs by userId","scenario_hash":"f454a5cd6123591a3cb38f5b9fec34d68962abfb3c84a87f71ec10b0b583f5f4","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-27T02:15:08.074924Z"},{"index":0,"name":"Filter audit logs by action","scenario_hash":"ab7c6fd3e34bf2d25d245ab17ece1bbb0d6ddbf228f010b0dc990085c231b5bd","mutation_count":4,"result":{"Total":4,"Killed":4,"Survived":0,"Errors":0},"tested_at":"2026-10-27T02:14:39.487783Z"},{"index":5,"name":"Filter audit logs by entityType","scenario_hash":"5fb819364ac77675247d3526be8778055d00ceb6c0809cbb3b0e1ba4eff9831b","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-27T02:14:39.487783Z"},{"index":6,"name":"Filter audit logs by userEmail","scenario_hash":"d6f33c169c802eb45da09b1107d86b9390f5d83a32c4f366e33c6ca33b9ddac3","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-27T02:14:39.487783Z"}]}
# acceptance-mutation-manifest-end

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
