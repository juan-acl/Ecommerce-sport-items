Feature: Discount Client Coupon API

  Background:
    Given the admin API client is initialized

  # Discount Client Coupon API-1
  Scenario: Creating a discount with targetClientId records the target client
    When the admin creates a discount with targetClientId "client-123"
    Then the created discount has targetClientId equal to "client-123"

  # Discount Client Coupon API-2
  Scenario: Creating a discount without targetClientId creates a global discount
    When the admin creates a discount without targetClientId
    Then the created discount has targetClientId equal to null

  # Discount Client Coupon API-3
  Scenario: A client-specific coupon can be applied by the targeted client
    Given a discount with targetClientId "client-123" exists with code "VIP10"
    When client "client-123" validates the coupon code "VIP10"
    Then the validation succeeds

  # Discount Client Coupon API-4
  Scenario: A client-specific coupon cannot be applied by a different client
    Given a discount with targetClientId "client-123" exists with code "VIP10"
    When client "client-456" validates the coupon code "VIP10"
    Then the validation fails with error "DISCOUNT_NOT_APPLICABLE"

  # Discount Client Coupon API-5
  Scenario: A global coupon can be applied by any client
    Given a global discount exists with code "GLOBAL10"
    When client "client-999" validates the coupon code "GLOBAL10"
    Then the validation succeeds

  # Discount Client Coupon API-6
  Scenario: Discount list response includes targetClientId for each discount
    When the client requests the discounts list
    Then each discount entry contains field "targetClientId"
