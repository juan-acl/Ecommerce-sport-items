# mutation-stamp: sha256=2911aa2ba522bfc717e60d7a8910bf8b928b83a6b8e3ce036c1436604b68eae8
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T22:52:40.535537Z","feature_name":"Discount No Approval UI","feature_path":"features/discounts-no-approval-ui.feature","background_hash":"02681590342f5e299ba73104e26ad558d7399f7dacf49f743eb7264eddbd9309","implementation_hash":"unknown","scenarios":[{"index":0,"name":"Discount list does not show Aprobar action for a global discount","scenario_hash":"370e48d1ab66b1c99c32aa556268248b8df2fab8fe93b49c12a0cce7983b5c79","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T22:52:40.535537Z"},{"index":1,"name":"Discount list does not show Pendiente aprobación status for a global discount","scenario_hash":"7fb0c8dcedef8660d863fdcc1a16e03f83991ec40e7502a86842afe2b60f2444","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T22:52:40.535537Z"},{"index":2,"name":"A newly created global percentage discount above 10% shows as Activo immediately","scenario_hash":"1bccf2f0918b3bf34848a98d527ac99925dd65ed682aedf8e26e97e89cf4b7cf","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T22:52:40.535537Z"}]}
# acceptance-mutation-manifest-end

Feature: Discount No Approval UI

  Background:
    Given an admin is authenticated and viewing the Descuentos page

  # Discount No Approval UI-1
  Scenario Outline: Discount list does not show Aprobar action for a global discount
    Given a global percentage discount with value <value> exists in the list
    Then the discount list does not show an "Aprobar" action for that discount

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |

  # Discount No Approval UI-2
  Scenario Outline: Discount list does not show Pendiente aprobación status for a global discount
    Given a global percentage discount with value <value> exists in the list
    Then the discount list does not show status "Pendiente aprobación" for that discount

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |

  # Discount No Approval UI-3
  Scenario Outline: A newly created global percentage discount above 10% shows as Activo immediately
    When the admin creates a global percentage discount with value <value>
    Then the discount list shows status "Activo" for that discount

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |
