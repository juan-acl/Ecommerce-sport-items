# mutation-stamp: sha256=d19b4324602c4e8cdafc3c132c954296f22a80add39b6f71ce3f0809e535bc4c
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T21:22:38.640815Z","feature_name":"Reports Products API","feature_path":"features/reports-products-api.feature","background_hash":"559c630a0ac90b6d101862a354c02cc79ec4a3b3ef26c0f28518559d19722c49","implementation_hash":"unknown","scenarios":[{"index":0,"name":"Products report response contains required fields for each product entry","scenario_hash":"2197a0ad560ab3489dd76e5ccb9bc9a1aa205713770b6118c54e2d05143092d9","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:22:38.640815Z"},{"index":1,"name":"Products report response contains required pagination fields","scenario_hash":"8892688debc11cc426eb544e2a4d7248f59f376286b195eead1c2abd87d86581","mutation_count":4,"result":{"Total":4,"Killed":4,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:22:38.640815Z"},{"index":4,"name":"stockStatus filter returns only products matching that stock condition","scenario_hash":"bfffbbf621193422b0bb87df8d74b9151df99b390f048b51e40a398ce6f59bd0","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:22:38.640815Z"}]}
# acceptance-mutation-manifest-end

Feature: Reports Products API

  Background:
    Given the admin API client is initialized

  # Reports Products API-1
  Scenario Outline: Products report response contains required fields for each product entry
    When the client requests the products report
    Then each product entry contains field "<field>"

    Examples:
      | field    |
      | id       |
      | name     |
      | category |
      | price    |
      | stock    |
      | minStock |

  # Reports Products API-2
  Scenario Outline: Products report response contains required pagination fields
    When the client requests the products report
    Then the response includes field "<field>"

    Examples:
      | field    |
      | products |
      | total    |
      | page     |
      | pageSize |

  # Reports Products API-3
  Scenario: Category filter returns only products in the given category
    When the client requests the products report with category "running"
    Then every product entry has category "running"

  # Reports Products API-4
  Scenario: Name filter returns only products whose name contains the search term
    When the client requests the products report with name "camisa"
    Then every product entry name contains "camisa"

  # Reports Products API-5
  Scenario Outline: stockStatus filter returns only products matching that stock condition
    When the client requests the products report with stockStatus "<status>"
    Then every product entry satisfies the "<status>" stock condition

    Examples:
      | status       |
      | out_of_stock |
      | low_stock    |
      | in_stock     |
