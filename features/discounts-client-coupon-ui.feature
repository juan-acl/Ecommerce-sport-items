# mutation-stamp: sha256=0ce7aa04d2d54b9eb3bb8ccc67ae9b83bee9d4828f001ce874d48abd7141273e
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T21:30:58.088810Z","feature_name":"Discount Client Coupon UI","feature_path":"features/discounts-client-coupon-ui.feature","background_hash":"02681590342f5e299ba73104e26ad558d7399f7dacf49f743eb7264eddbd9309","implementation_hash":"unknown","scenarios":[]}
# acceptance-mutation-manifest-end

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

  # Discount Client Coupon UI-6
  Scenario: A newly created client-specific coupon shows status Pendiente aprobación
    Given the admin has opened the create discount form
    And the admin has selected client "Juan Pérez" with id "client-123" in the client selector
    When the admin submits the form
    Then the discount list shows status "Pendiente aprobación" for that discount

  # Discount Client Coupon UI-7
  Scenario: Discount list shows Aprobar action for a pending client-specific coupon
    Given a client-specific discount targeting "Juan Pérez" is pending approval in the list
    Then the discount list shows an "Aprobar" action for that discount

  # Discount Client Coupon UI-8
  Scenario: Clicking Aprobar on a client-specific coupon changes its status to Activo
    Given a client-specific discount targeting "Juan Pérez" is pending approval in the list
    When the admin clicks "Aprobar" for that discount
    Then the discount list shows status "Activo" for that discount
