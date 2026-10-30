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
