# mutation-stamp: sha256=9cb8dacafec1a885d23b34fb5e3ac34ff7c6fe312b5507b1feed9834b24b4e6d
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-31T14:07:09.664233Z","feature_name":"Discount Special Coupon UI","feature_path":"features/discounts-special-coupon-ui.feature","background_hash":"02681590342f5e299ba73104e26ad558d7399f7dacf49f743eb7264eddbd9309","implementation_hash":"unknown","scenarios":[{"index":4,"name":"A newly created special percentage coupon at or below 10% shows Pendiente aprobación","scenario_hash":"9ffc5a76976270c470b6fd57e2ae603cd9fad74b9d9ff9e1e9fb643af87b0eee","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-31T14:07:09.664233Z"},{"index":5,"name":"A newly created special percentage coupon above 10% shows Activo and sends isSpecial true","scenario_hash":"a521426c918e760fad141bf03537e2f4e5a7c43ad4b81145bc684d7c6b0e7429","mutation_count":2,"result":{"Total":2,"Killed":2,"Survived":0,"Errors":0},"tested_at":"2026-10-31T14:07:09.664233Z"}]}
# acceptance-mutation-manifest-end

Feature: Discount Special Coupon UI

  Background:
    Given an admin is authenticated and viewing the Descuentos page

  # Discount Special Coupon UI-1
  Scenario: Discount list shows an Especial badge for special coupons
    Given a special coupon targeting "Juan Pérez" exists in the list
    Then the discount list shows an "Especial" badge for that discount

  # Discount Special Coupon UI-2
  Scenario: Discount list does not show an Especial badge for regular discounts
    Given a global discount exists in the list
    Then the discount list does not show an "Especial" badge for that discount

  # Discount Special Coupon UI-3
  Scenario: Create special coupon form requires a target client and has no code field
    When the admin opens the create special coupon form
    Then the form displays a required field labeled "Cliente específico"
    And the form does not display a field labeled "Código"

  # Discount Special Coupon UI-4
  Scenario: Submitting the create special coupon form without a target client shows a validation error
    Given the admin has opened the create special coupon form
    When the admin submits the form without selecting a client
    Then the form shows error "Debes seleccionar un cliente"

  # Discount Special Coupon UI-5
  Scenario Outline: A newly created special percentage coupon at or below 10% shows Pendiente aprobación
    Given the admin has opened the create special coupon form
    And the admin has selected client "Juan Pérez" with id "client-123" in the client selector
    When the admin submits the form with percentage value <value>
    Then the discount list shows status "Pendiente aprobación" for that discount

    Examples:
      | value |
      | 5     |
      | 10    |

  # Discount Special Coupon UI-6
  Scenario Outline: A newly created special percentage coupon above 10% shows Activo and sends isSpecial true
    Given the admin has opened the create special coupon form
    And the admin has selected client "Juan Pérez" with id "client-123" in the client selector
    When the admin submits the form with percentage value <value>
    Then the discount list shows status "Activo" for that discount
    And the create discount API request includes isSpecial equal to true

    Examples:
      | value |
      | 11    |
      | 50    |
