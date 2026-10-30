# mutation-stamp: sha256=acd6236e5b3004f43c8bdfb324ab4512ca7cab61043d39abdf218fdacc66efe5
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T22:52:29.853311Z","feature_name":"Discount No Approval Required","feature_path":"features/discounts-no-approval.feature","background_hash":"559c630a0ac90b6d101862a354c02cc79ec4a3b3ef26c0f28518559d19722c49","implementation_hash":"unknown","scenarios":[{"index":0,"name":"Creating a global percentage discount above 10% activates it immediately","scenario_hash":"7f6339da2628b91a9592c94141ef082dfff30266baa60cc8217488a2895c8c97","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T22:52:29.853311Z"},{"index":1,"name":"Creating a global percentage discount above 10% sets needsApproval to false","scenario_hash":"1a244c661c599f9c70e2aab8f05a9745ee2dcac71e732517445ca19ac9bb30bb","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T22:52:29.853311Z"},{"index":2,"name":"A global percentage discount above 10% can be toggled freely without prior approval","scenario_hash":"e1b5b695e15a810f7193dee678ddecb52efd699723cfc1592f235f2a4a16531b","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-30T22:52:29.853311Z"}]}
# acceptance-mutation-manifest-end

Feature: Discount No Approval Required

  Background:
    Given the admin API client is initialized

  # Discount No Approval Required-1
  Scenario Outline: Creating a global percentage discount above 10% activates it immediately
    When the admin creates a global percentage discount with value <value>
    Then the created discount has isActive equal to true

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |

  # Discount No Approval Required-2
  Scenario Outline: Creating a global percentage discount above 10% sets needsApproval to false
    When the admin creates a global percentage discount with value <value>
    Then the created discount has needsApproval equal to false

    Examples:
      | value |
      | 11    |
      | 50    |
      | 100   |

  # Discount No Approval Required-3
  Scenario Outline: A global percentage discount above 10% can be toggled freely without prior approval
    Given a global percentage discount with value 25 exists and is <initialState>
    When the admin toggles the discount <action>
    Then the discount has isActive equal to <expected>

    Examples:
      | initialState | action   | expected |
      | active       | inactive | false    |
      | inactive     | active   | true     |
