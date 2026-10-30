# mutation-stamp: sha256=7774526ab1fcda38f9547f35f86a2d74f8913bb027f9c3e9265381abee305746
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T21:30:55.642745Z","feature_name":"Discount Client Coupon API","feature_path":"features/discounts-client-coupon-api.feature","background_hash":"559c630a0ac90b6d101862a354c02cc79ec4a3b3ef26c0f28518559d19722c49","implementation_hash":"unknown","scenarios":[]}
# acceptance-mutation-manifest-end

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
  Scenario: An approved client-specific coupon can be applied by the targeted client
    Given an approved discount with targetClientId "client-123" exists with code "VIP10"
    When client "client-123" validates the coupon code "VIP10"
    Then the validation succeeds

  # Discount Client Coupon API-4
  Scenario: An approved client-specific coupon cannot be applied by a different client
    Given an approved discount with targetClientId "client-123" exists with code "VIP10"
    When client "client-456" validates the coupon code "VIP10"
    Then the validation fails with error "DISCOUNT_NOT_APPLICABLE"

  # Discount Client Coupon API-4b
  Scenario: A pending client-specific coupon cannot be applied even by the targeted client
    Given a pending discount with targetClientId "client-123" exists with code "VIP10"
    When client "client-123" validates the coupon code "VIP10"
    Then the validation fails with error "DISCOUNT_PENDING_APPROVAL"

  # Discount Client Coupon API-5
  Scenario: A global coupon can be applied by any client
    Given a global discount exists with code "GLOBAL10"
    When client "client-999" validates the coupon code "GLOBAL10"
    Then the validation succeeds

  # Discount Client Coupon API-6
  Scenario: Discount list response includes targetClientId for each discount
    When the client requests the discounts list
    Then each discount entry contains field "targetClientId"

  # Discount Client Coupon API-7
  Scenario: Creating a client-specific coupon requires approval and is initially inactive
    When the admin creates a discount with targetClientId "client-123"
    Then the created discount has needsApproval equal to true
    And the created discount has isActive equal to false

  # Discount Client Coupon API-8
  Scenario: Approving a client-specific coupon activates it and clears needsApproval
    Given a client-specific discount with code "VIP10" is pending approval
    When the admin approves the discount
    Then the discount has isActive equal to true
    And the discount has needsApproval equal to false
