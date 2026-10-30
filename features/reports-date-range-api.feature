# mutation-stamp: sha256=77083a295f47a27a7ff65ab8083ea49ad02d52c3095625ab5b516f63d65b41b9
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T00:34:10.279524Z","feature_name":"Reports Date Range API","feature_path":"features/reports-date-range-api.feature","background_hash":"559c630a0ac90b6d101862a354c02cc79ec4a3b3ef26c0f28518559d19722c49","implementation_hash":"unknown","scenarios":[{"index":0,"name":"Sales report with explicit date range scopes totalOrders to that window","scenario_hash":"be0b00b81d3c668245d8db24366a1ead33dfe1008ce5f49a77367295b092fcf5","mutation_count":4,"result":{"Total":4,"Killed":4,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:10.279524Z"},{"index":2,"name":"Purchases report with explicit date range scopes totalPurchases to that window","scenario_hash":"8fe654b862255ce7cb285b804861476e2f58c4839c612de0879db12e234f7809","mutation_count":4,"result":{"Total":4,"Killed":4,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:10.279524Z"},{"index":4,"name":"Client analytics report with explicit date range scopes newClients to that window","scenario_hash":"1408c7b213938a2b1a7f7b862e72d171c58e6cfd3f42da403e377baca283622f","mutation_count":4,"result":{"Total":4,"Killed":4,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:10.279524Z"}]}
# acceptance-mutation-manifest-end

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
