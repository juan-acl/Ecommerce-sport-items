Feature: Reports Client Analytics API

  Background:
    Given the admin API client is initialized

  # Reports Client Analytics API-1
  Scenario Outline: Client analytics response contains required top-level fields
    When the client requests the client analytics report with period "month"
    Then the response includes field "<field>"

    Examples:
      | field        |
      | totalClients |
      | newClients   |
      | topClients   |

  # Reports Client Analytics API-2
  Scenario Outline: Each topClients entry contains required fields
    When the client requests the client analytics report with period "month"
    Then each entry in "topClients" contains field "<field>"

    Examples:
      | field      |
      | clientId   |
      | clientName |
      | orderCount |
      | totalSpent |

  # Reports Client Analytics API-3
  Scenario: topClients list is ordered by totalSpent descending
    When the client requests the client analytics report with period "month"
    Then the "topClients" list is ordered by "totalSpent" descending

  # Reports Client Analytics API-4
  Scenario Outline: Period parameter scopes newClients to the requested time window
    When the client requests the client analytics report with period "<period>"
    Then the response "newClients" counts only clients registered within "<period>"

    Examples:
      | period |
      | day    |
      | week   |
      | month  |
