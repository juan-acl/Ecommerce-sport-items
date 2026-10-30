Feature: Discount No Approval Required

  Background:
    Given the admin API client is initialized

  # Discount No Approval Required-1
  Scenario Outline: Creating a percentage discount above 10% activates it immediately
    When the admin creates a percentage discount with value <value>
    Then the created discount has isActive equal to true

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |

  # Discount No Approval Required-2
  Scenario Outline: Creating a percentage discount above 10% sets needsApproval to false
    When the admin creates a percentage discount with value <value>
    Then the created discount has needsApproval equal to false

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |

  # Discount No Approval Required-3
  Scenario Outline: A percentage discount above 10% can be toggled freely without prior approval
    Given a percentage discount with value 25 exists and is <initialState>
    When the admin toggles the discount <action>
    Then the discount has isActive equal to <expected>

    Examples:
      | initialState | action   | expected |
      | active       | inactive | false    |
      | inactive     | active   | true     |
