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
