Feature: Discount Special Coupon API

  Background:
    Given the admin API client is initialized

  # Discount Special Coupon API-1
  Scenario: Creating a special coupon sets its key properties
    When the admin creates a special coupon for client "client-123" with value 15
    Then the created discount has a non-empty code
    And the created discount has maxUses equal to 1
    And the created discount has isSpecial equal to true
    And the created discount has targetClientId equal to "client-123"

  # Discount Special Coupon API-2
  Scenario: A special coupon cannot be created without a target client
    When the admin attempts to create a special coupon without a targetClientId
    Then the request fails with error "SPECIAL_COUPON_REQUIRES_CLIENT"

  # Discount Special Coupon API-3
  Scenario Outline: A special percentage coupon at or below 10% requires approval
    When the admin creates a special coupon for client "client-123" with value <value>
    Then the created discount has needsApproval equal to true
    And the created discount has isActive equal to false

    Examples:
      | value |
      | 5     |
      | 10    |

  # Discount Special Coupon API-4
  Scenario Outline: A special percentage coupon above 10% activates immediately
    When the admin creates a special coupon for client "client-123" with value <value>
    Then the created discount has needsApproval equal to false
    And the created discount has isActive equal to true

    Examples:
      | value |
      | 11    |
      | 50    |

  # Discount Special Coupon API-5
  Scenario: An approved special coupon can be validated by the target client
    Given an approved special coupon for client "client-123" with code "SPEC-ABC123" exists
    When client "client-123" validates the coupon code "SPEC-ABC123"
    Then the validation succeeds

  # Discount Special Coupon API-6
  Scenario: An approved special coupon cannot be validated by a different client
    Given an approved special coupon for client "client-123" with code "SPEC-ABC123" exists
    When client "client-456" validates the coupon code "SPEC-ABC123"
    Then the validation fails with error "DISCOUNT_NOT_APPLICABLE"

  # Discount Special Coupon API-7
  Scenario: A special coupon is invalidated after it is used once
    Given an approved special coupon for client "client-123" with code "SPEC-ABC123" has been used once
    When client "client-123" validates the coupon code "SPEC-ABC123"
    Then the validation fails with error "DISCOUNT_INVALID"

  # Discount Special Coupon API-8
  Scenario: Discount list response includes isSpecial for each discount
    When the client requests the discounts list
    Then each discount entry contains field "isSpecial"
