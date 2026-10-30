# mutation-stamp: sha256=55502b4147e8907bdb21002ea749e7c6f466c95de7f5f6ecb4ff18885d57d30c
# acceptance-mutation-manifest-begin
# {"version":1,"tested_at":"2026-10-30T21:30:00.171356Z","feature_name":"Discount No Approval Required","feature_path":"features/discounts-no-approval.feature","background_hash":"559c630a0ac90b6d101862a354c02cc79ec4a3b3ef26c0f28518559d19722c49","implementation_hash":"unknown","scenarios":[{"index":0,"name":"Creating a percentage discount above 10% activates it immediately","scenario_hash":"c22f6900423afd0eb2ad9000234ea21ad76a2d618461a7cfc3ee49977a773948","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:30:00.171356Z"},{"index":1,"name":"Creating a percentage discount above 10% sets needsApproval to false","scenario_hash":"b7f907afcf4419fd3bacda362bcefcde7d2b7994e98ed272e3291c0377d0efc4","mutation_count":3,"result":{"Total":3,"Killed":3,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:30:00.171356Z"},{"index":2,"name":"A percentage discount above 10% can be toggled freely without prior approval","scenario_hash":"6cc02f94ffe34bfe21bc0ffe52fe035cda929bda7ec3dee206c4e923cd399ddb","mutation_count":6,"result":{"Total":6,"Killed":6,"Survived":0,"Errors":0},"tested_at":"2026-10-30T21:24:23.918882Z"}]}
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
