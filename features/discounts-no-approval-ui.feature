# mutation-stamp: sha256=d12c9d69d11d164c2efe77c17108647eb25685d67a85ff362704551ce38dca95
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T21:30:52.161650Z","feature_name":"Discount No Approval UI","feature_path":"features/discounts-no-approval-ui.feature","background_hash":"02681590342f5e299ba73104e26ad558d7399f7dacf49f743eb7264eddbd9309","implementation_hash":"unknown","scenarios":[{"index":0,"name":"Discount list does not show Aprobar action for any discount","scenario_hash":"544d510f2eb96d250f6458b085b423fcfdecbc81a302e3cc7e4531000747ce30","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:30:52.161650Z"},{"index":1,"name":"Discount list does not show Pendiente aprobación status for any discount","scenario_hash":"a016fc1960d3450e0c3308b14f1605772d201fb9213585d5244ca0d708ca8178","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:30:52.161650Z"},{"index":2,"name":"A newly created percentage discount above 10% shows as Activo immediately","scenario_hash":"59b74ae0e59b9422674c1d146ec3d712a0a7124f2de98a20b1e36f8c8ac6ae51","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:30:52.161650Z"}]}
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
