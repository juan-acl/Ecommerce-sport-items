Feature: Discount No Approval UI

  Background:
    Given an admin is authenticated and viewing the Descuentos page

  # Discount No Approval UI-1
  Scenario Outline: Discount list does not show Aprobar action for any discount
    Given a percentage discount with value <value> exists in the list
    Then the discount list does not show an "Aprobar" action for that discount

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |

  # Discount No Approval UI-2
  Scenario Outline: Discount list does not show Pendiente aprobación status for any discount
    Given a percentage discount with value <value> exists in the list
    Then the discount list does not show status "Pendiente aprobación" for that discount

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |

  # Discount No Approval UI-3
  Scenario Outline: A newly created percentage discount above 10% shows as Activo immediately
    When the admin creates a percentage discount with value <value>
    Then the discount list shows status "Activo" for that discount

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |
