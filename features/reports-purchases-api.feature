# mutation-stamp: sha256=68964b7a3ba3e29d482d64a2b0914c529fee6837339a606677af641d7210e1b4
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T00:30:52.260878Z","feature_name":"Reports Purchases API","feature_path":"features/reports-purchases-api.feature","background_hash":"559c630a0ac90b6d101862a354c02cc79ec4a3b3ef26c0f28518559d19722c49","implementation_hash":"unknown","scenarios":[{"index":4,"name":"Period parameter scopes purchases to the requested time window","scenario_hash":"9baea74d6d528c630b854119bfe82da33cad6a35a968a0ac741582e96bcc8a0a","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:30:30.108959Z"},{"index":0,"name":"Purchases summary response contains required top-level fields","scenario_hash":"c32c51a00b28e91790d6e0a51cc1178580cf6268cb3ce158fd5fe7e5d086438d","mutation_count":5,"result":{"Total":5,"Killed":5,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:23:32.243287Z"},{"index":1,"name":"purchasesByStatus contains each expected status key","scenario_hash":"a1f68b533432115fe97ac803d195a619331397bfae6b1121dcd00e5fc164e4ee","mutation_count":4,"result":{"Total":4,"Killed":4,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:23:32.243287Z"},{"index":2,"name":"Each topSuppliers entry contains required fields","scenario_hash":"12257f1d6912c14043baf808953b3a90586353ca6cbe199a6697c925860b2ba9","mutation_count":4,"result":{"Total":4,"Killed":4,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:23:32.243287Z"}]}
# acceptance-mutation-manifest-end

Feature: Reports Purchases API

  Background:
    Given the admin API client is initialized

  # Reports Purchases API-1
  Scenario Outline: Purchases summary response contains required top-level fields
    When the client requests the purchases report with period "month"
    Then the response includes field "<field>"

    Examples:
      | field               |
      | totalPurchases      |
      | totalCost           |
      | averagePurchaseCost |
      | purchasesByStatus   |
      | topSuppliers        |

  # Reports Purchases API-2
  Scenario Outline: purchasesByStatus contains each expected status key
    When the client requests the purchases report with period "month"
    Then the "purchasesByStatus" object contains key "<status>"

    Examples:
      | status    |
      | pending   |
      | partial   |
      | received  |
      | cancelled |

  # Reports Purchases API-3
  Scenario Outline: Each topSuppliers entry contains required fields
    When the client requests the purchases report with period "month"
    Then each entry in "topSuppliers" contains field "<field>"

    Examples:
      | field          |
      | supplierId     |
      | supplierName   |
      | totalPurchases |
      | totalSpent     |

  # Reports Purchases API-4
  Scenario: topSuppliers list is ordered by totalSpent descending
    When the client requests the purchases report with period "month"
    Then the "topSuppliers" list is ordered by "totalSpent" descending

  # Reports Purchases API-5
  Scenario Outline: Period parameter scopes purchases to the requested time window
    When the client requests the purchases report with period "<period>"
    Then the response "totalPurchases" counts only purchases created within "<period>"

    Examples:
      | period |
      | day    |
      | week   |
      | month  |
