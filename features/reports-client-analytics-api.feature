# mutation-stamp: sha256=9ae3c9226fde9a492edb84a662c8bc0b7ea240daf69143f92b6b415a646ebdbd
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T00:34:22.637889Z","feature_name":"Reports Client Analytics API","feature_path":"features/reports-client-analytics-api.feature","background_hash":"559c630a0ac90b6d101862a354c02cc79ec4a3b3ef26c0f28518559d19722c49","implementation_hash":"unknown","scenarios":[{"index":0,"name":"Client analytics response contains required top-level fields","scenario_hash":"6daafbfe31204b9a9e3c111d44f539906932c58ec8c750572f3d4f95db2210eb","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:22.637889Z"},{"index":1,"name":"Each topClients entry contains required fields","scenario_hash":"f9f0041b2624859e1386a35a0027e8a3700a1a39f7689296168a584031174c46","mutation_count":4,"result":{"Total":4,"Killed":4,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:22.637889Z"},{"index":3,"name":"Period parameter scopes newClients to the requested time window","scenario_hash":"9ad66fe1a30bc6e235f9c92e15eeeeacc1211558bdbf0d50ba28201200ff84f2","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T00:34:22.637889Z"}]}
# acceptance-mutation-manifest-end

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
