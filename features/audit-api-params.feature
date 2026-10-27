Feature: Audit API Query Parameters

  Background:
    Given the admin API client is initialized

  # Audit API Query Parameters-1
  Scenario Outline: Each filter maps to the correct query parameter name
    When the client requests audit logs with filter "<field>" set to "<value>"
    Then the HTTP request includes query parameter "<param>" equal to "<value>"

    Examples:
      | field      | value             | param      |
      | action     | ORDER_APPROVED    | action     |
      | userId     | user-123          | userId     |
      | userEmail  | admin@example.com | userEmail  |
      | entityType | order             | entityType |
      | fromDate   | 2026-10-01        | fromDate   |
      | toDate     | 2026-10-31        | toDate     |

  # Audit API Query Parameters-2
  Scenario: Undefined filters are omitted from the request
    When the client requests audit logs with no filters
    Then the HTTP request does not include parameters action, userId, userEmail, entityType, fromDate, toDate

  # Audit API Query Parameters-3
  Scenario: Changing any filter clears the cursor
    When the client requests audit logs with filter "action" set to "ORDER_APPROVED"
    Then the HTTP request does not include the cursor parameter
