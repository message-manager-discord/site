/reports

The "main" page, it displays a list of reports for the current user

Shows a button to get to review if user is staff

/reports/review

Displays a list of reports that need to be reviewed. Default it filters for reports that have been assigned to the current staff member and are open
Can show all reports to review or can be filted by: status, assigned staff member, report type, guild

The report list:

Shows the:

- title
- status
- reporting user (staff routes)
- assigned staff member (staff routes)
- how many messages have been sent in that report
- The guild the report was made in (staff routes)
- A preview (first 30 ish characters, depends on space) of the message that is reported

/reports/:id

Displays a report and all the messages in that report
The message that is reported, and the reason for the report is displayed at the top
Then all the messages in the report are displayed
Also a button to view the history of the message is displayed
Each user that edited a message is displayed
At the bottom there is a form to send a message to the report

For staff, when they are not viewing a report made by them, buttons for closing, accepting (assigning the report to the current staff member), and for viewing previous messages sent in the channel are displayed. Also a summary of how many reports have been actioned against the guild in the past is displayed

When a report is resolved the report may be marked as a few opitons:

Pending: awaiting review
Assigned: reviewed but not actioned

Spam: The report was not valid and should be deemed spam - this counts to a monthly limit of 3 spam reports per user before they are banned from reporting for that month
Invalid: The report was not valid and should not be deemed spam - this does not count to a monthly limit of 3 invalid reports
Warning: A record against the guild is made - this should include a reason why etc. Does not restrict the guild in any way
Ban: The guild is banned from using the bot - this should include a reason why etc. Prevents any actions being taken by that guild (may have a time limit)
User Ban: The user, or users, that send/edited the message and the concerning content are banned from using the bot. Prevents any actions being taken by that user / those users (may have a time limit)

Bans and User Bans require approval from an owner, there is a seperate waiting state for each type.

Messages sent to reports may be marked as private and will only be visible to staff members - when a ban or a user ban is submitted a private message is submitted alongside it as a reason.
Pending bans and pending user bans will display to the user as "assigned" both in the ui and api

# API ROUTES:

## Enums:

### Report Status

#### Base

- Pending - "pending"
- Assigned - "assigned"
- Spam - "spam"
- Invalid - "invalid"
- Warning - "warning"
- Review Ban - "review_ban" - staff only
- Review User Ban - "review_user_ban" - staff only
- Review - "review" - staff only
- Ban - "ban"
- User Ban - "user_ban"

#### Extends base, for use when requesting reports

- Open - "open" - includes pending and assigned
- Closed - "closed" - includes spam, invalid, warning, ban, user_ban

## Objects:

### Report Message

```json
{
    "id": "snowflake",
    "content": "string",
    "author_id": "snowflake",
    "created_at": "datetime",
    "private": "boolean" optional only included if user is staff
}

```

### Report

```json
{
    "id": "snowflake",
    "title": "string",
    "status": "report_status",
    "reporting_user_id": "snowflake",
    "assigned_staff_id": "snowflake", nullable
    "guild_id": "snowflake",
    "messages": [
reportmessageobjects
    ],
    "created_at": "string",
    "updated_at": "string",
    "guild_data": {
        "icon": "string",
        "name": "string",
        "past_warning_count": "integer", optional only included if user is staff
        "past_appealed_ban_count": "integer", optional only included if user is staff
        "banned": "boolean", optional only included if user is staff
    },
    "reported_message": {
        "id": "snowflake",
        "content": "string",
        "author_id": "snowflake",
        "created_at": "datetime",
        "edit_count": "integer",
    },
    "other_reports_on_same_message": [
        "snowflake"
    ]
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

### Reported message context

```json
{
    "id": "snowflake",
    "content": "string",
    "last_acting_user_id": "snowflake",
    "created_at": "datetime",
    "edited_at": "datetime", nullable
    "more": "boolean",

}
```

### Reported message history

```json
{
    "id": "snowflake",
    "content": "string",
    "acting_user_id": "snowflake",
    "created_at": "datetime",
    "edited_at": "datetime", nullable
    "more": "boolean"
}
```

### List Reports

```json
[
    {
        "id": "snowflake",
        "title": "string",
        "status": "report_status",
        "reporting_user_id": "snowflake",
        "assigned_staff_id": "snowflake", nullable
        "guild_id": "snowflake",
        "created_at": "string",
        "updated_at": "string",
        "message_preview": "string",
        "message_count": "integer",
    }
]
```

### Create Report

```json
{
  "title": "string",
  "message_id": "snowflake",
  "reason": "string"
}
```

## Requests

### Get reports

GET /api/reports?status={report_status}&assigned_to={user_id}&guild={guild_id}&limit={int 1-100}&before={report_id}

#### Querystring

- status - optional - filter by report status
- assigned_to - optional - filter by assigned staff member (only available to staff)
- guild - optional - filter by guild (only available to staff)
- limit - optional - limit the number of reports returned (min 10, max 100, default 50)
- before - optional - get reports before this report id

#### Response

List reports object

### Get report

GET /api/reports/{report_id}

#### Response

Report object

### Create report

POST /api/reports

#### Body

Create report object

#### Response

Report object

### Get Report Message

GET /api/reports/{report_id}/messages/{message_id}

#### Response

List of report message object

### Send Report Message

POST /api/reports/{report_id}/messages

#### Body

```json
{
  "content": "string",
  "private": "boolean" only allowed if user is staff
}
```

#### Response

Report message object

### Get Report Message Context

GET /api/reports/{report_id}/context?position={number}

#### Querystring

- position - optional - the position of the message in the report (default 0)

0 is the reported message, 1 is the message sent by the bot after the reported message etc. -1 is the message sent through the bot before the reported message etc

#### Response

Reported message context object

### Get Report Message History

GET /api/reports/{report_id}/history?position={number}

#### Querystring

- position - optional - the position of the message in the report (default 0)

0 is the reported message, 1 is the message history. -1 is what the message has been edited to after the report was submitted

#### Response

Reported message history object

### Assign Report

POST /api/reports/{report_id}/assign

(staff only)

#### Body

```json
{
  "assigned_staff_id": "snowflake", optional
}
```

Only staff may accept reports
Assigned staff id may only be set for admins, if it is undefined then the report will be assigned to the current user
If a report is assigned a report may not be assigned to another user by a non admin

#### Response

Report object

### Close Report

POST /api/reports/{report_id}/close

This is only for status spam, invalid and warning

If a report is currently awaiting a review it may only be closed by an admin

The status ban and user ban may be set if the report is currently await a review

(staff only)

#### Body

```json
{
  "status": "report_status",
  "message": "string"
}
```

#### Response

Report object

### Submit Review

POST /api/reports/{report_id}/review

This is only for status ban and user ban, and review

(staff only)

#### Body

```json
{
  "status": "report_status", either ban or user ban
  "reason": "string"
}
```

#### Response

Report object
