# mutation-stamp: sha256=f4b0af8d5d4dd3da6c3b1f78fffeb4a8da854691f8232b4c6570d71a5c15b6c7
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-31T14:07:02.655177Z","feature_name":"Discount Special Coupon API","feature_path":"features/discounts-special-coupon-api.feature","background_hash":"559c630a0ac90b6d101862a354c02cc79ec4a3b3ef26c0f28518559d19722c49","implementation_hash":"unknown","scenarios":[{"index":2,"name":"A special percentage coupon at or below 10% requires approval","scenario_hash":"de0f7f5db2d29dd20799567428f0c9fc6545cde480f543999908191d0828de9c","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-31T14:07:02.655177Z"},{"index":3,"name":"A special percentage coupon above 10% activates immediately","scenario_hash":"f4547de0cd618524ceecc8f6473fb25103cbb55d01f3cb3c13151dee5d3e54d5","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-31T14:07:02.655177Z"}]}
# acceptance-mutation-manifest-end

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
