Feature: Discount Client Coupon UI

  Background:
    Given an admin is authenticated and viewing the Descuentos page

  # Discount Client Coupon UI-1
  Scenario: Create discount form shows a target client selector field
    When the admin opens the create discount form
    Then the form displays a field labeled "Cliente específico"

  # Discount Client Coupon UI-2
  Scenario: Discount list shows Global for discounts without a target client
    Given a global discount exists in the list
    Then the discount list shows "Global" in the target client column for that discount

  # Discount Client Coupon UI-3
  Scenario: Discount list shows the target client name for client-specific discounts
    Given a client-specific discount targeting "Juan Pérez" exists in the list
    Then the discount list shows "Juan Pérez" in the target client column for that discount

  # Discount Client Coupon UI-4
  Scenario: Discount list has a target client column header
    Then the discount list has a column labeled "Cliente"

  # Discount Client Coupon UI-5
  Scenario: Submitting the create discount form with a target client includes targetClientId in the request
    Given the admin has opened the create discount form
    And the admin has selected client "Juan Pérez" with id "client-123" in the client selector
    When the admin submits the form
    Then the create discount API request includes targetClientId "client-123"
