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
