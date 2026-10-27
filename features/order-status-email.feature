# mutation-stamp: sha256=cfa763125f06d7c40293ce7663b5ff329617e8281206e251e79212ee0dc81515
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-27T02:22:12.166282Z","feature_name":"Order Status Email Notification","feature_path":"features/order-status-email.feature","background_hash":"4f9f359f16e55b6cf28ca772f30eddb54c501103efaf7bffa63267226811a306","implementation_hash":"unknown","scenarios":[{"index":1,"name":"Customer receives email when order is approved or rejected","scenario_hash":"1b4c72b6444026cc9ec32104e8619dc89ccba67387f99d902bc01f95920aaa31","mutation_count":4,"result":{"Total":4,"Killed":4,"Survived":0,"Errors":0},"tested_at":"2026-10-27T02:22:12.166282Z"},{"index":2,"name":"Customer receives email on each admin status transition","scenario_hash":"dd5de71ba3e8e4b412bff3ef3e2fb8e99e9109e797a5863e33b827da18ee1350","mutation_count":10,"result":{"Total":10,"Killed":10,"Survived":0,"Errors":0},"tested_at":"2026-10-27T02:22:12.166282Z"}]}
# acceptance-mutation-manifest-end

Feature: Order Status Email Notification

  Background:
    Given a customer with email "cliente@example.com" and name "Juan Perez" exists
    And an email service is configured

  # Order Status Email Notification-1
  Scenario: Customer receives confirmation email after checkout
    Given the customer has items in their cart
    When the customer completes checkout
    Then an order confirmation email is sent to "cliente@example.com"
    And the order status is "paid"

  # Order Status Email Notification-2
  Scenario Outline: Customer receives email when order is approved or rejected
    Given an order with status "paid" belongs to the customer
    When an admin "<decision>" the order
    Then an order status update email is sent to "cliente@example.com" with new status "<new_status>"

    Examples:
      | decision | new_status  |
      | approves | processing  |
      | rejects  | cancelled   |

  # Order Status Email Notification-3
  Scenario Outline: Customer receives email on each admin status transition
    Given an order with status "<current_status>" belongs to the customer
    When an admin updates the order status to "<new_status>"
    Then an order status update email is sent to "cliente@example.com" with new status "<new_status>"

    Examples:
      | current_status | new_status  |
      | paid           | processing  |
      | paid           | cancelled   |
      | processing     | shipped     |
      | processing     | cancelled   |
      | shipped        | delivered   |

  # Order Status Email Notification-4
  Scenario: Email failure does not fail order status transition
    Given an order with status "paid" belongs to the customer
    And the email service is unavailable
    When an admin updates the order status to "processing"
    Then the order status is updated to "processing"
    And no error is returned to the admin

  # Order Status Email Notification-5
  Scenario: Email failure does not fail checkout
    Given the customer has items in their cart
    And the email service is unavailable
    When the customer completes checkout
    Then the order is created with status "paid"
    And no error is returned to the customer
