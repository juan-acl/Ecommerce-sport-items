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
