Intermediate Full Stack Developer – Technical Case Study
Email Campaign Management System
Time Allowed
Maximum completion time: 3 calendar days
The candidate may complete the assessment after working hours. We are not expecting a production-ready application or a highly polished user interface.
The objective is to assess your ability to develop a functional full-stack solution using Laravel, MySQL and Angular, and to demonstrate your approach to API development, database design, asynchronous processing, validation, testing and front-end development.
Expected effort: Approximately 8–12 hours.
Submission Share a Git repository link (GitHub/GitLab/Bitbucket) with your completed work

---

1. Business Problem
   Our marketing team needs to send bulk email campaigns.
   Currently, campaigns are handled manually, which is slow and difficult to manage. We need a simple application that allows a marketing user to create an email campaign, submit a list of recipients and have those emails processed asynchronously.
   The solution should consist of:
   Angular Front End → Laravel API → MySQL Database → Queue/Worker
   The application should allow a user to:
1. Create an email campaign.
1. Enter multiple recipients.
1. Validate the campaign information.
1. Store the campaign.
1. Queue individual emails for processing.
1. Process the queued emails asynchronously.
1. View submitted campaigns and their statuses.

---

2. Technology Stack
   Please use the following technologies:
   Backend
   • Laravel(Latest version)
   • PHP
   • MySQL
   • PHPUnit
   • Laravel Queue
   Front Endnone
   Framework Angular 17+ (standalone components preferred)
   Language TypeScript (strict mode)
   Styling SCSS + Bootstrap 5 (grid and utilities only — no Bootstrap JS)
   Component Docs Storybook for Angular (see note in US-2)
   Testing Jasmine/Karma or Jest
   State Management Angular Signals or a simple service-based approach
   Build Angular CLI

Our customers need a way to quickly assemble professional email templates from pre-built content blocks (Header, Text, Image, Button) without writing code. Your task is to build a front-end application that lets users add these blocks to compose a template, edit each block's content via a sidebar form, and see changes reflected in a live preview in real-time.
The content block components should be built as a small design system — reusable, documented, and decoupled from the application logic.

---

3. Task 1 – Submit a Campaign
   User Story
   As a marketing user
   I want to submit campaign information
   So that emails can be queued for sending.
   Create a Laravel API endpoint:
   POST /api/campaigns
   The endpoint should accept:
   {
   "name": "Spring Sale",
   "subject": "50% Off This Weekend!",
   "body": "Check out our amazing deals...",
   "recipient_emails": [
   "email1@test.com",
   "email2@test.com"
   ]
   }
   The API should:
   • Accept the campaign data.
   • Validate the information.
   • Store the campaign.
   • Create the required email jobs.
   • Return the campaign ID.
   • Return the number of recipients.
   Example successful response:
   {
   "campaign_id": 1,
   "recipient_count": 2,
   "status": "queued"
   }

---

4. Task 2 – Validate Input
   All campaign data must be validated before it is stored.
   Validation Rules
   Campaign name
   • Required
   • Maximum 255 characters
   Subject
   • Required
   • Maximum 255 characters
   Body
   • Required
   • Maximum 10,000 characters
   Recipient emails
   • At least one recipient is required.
   • Each email must be in a valid email format.
   • Duplicate email addresses should not be accepted.
   If validation fails, return an appropriate HTTP error response with clear error details.
   Example:
   {
   "error": "Invalid input",
   "details": {
   "subject": "Subject is required",
   "recipient_emails": "Must contain valid emails"
   }
   }
   The solution should also demonstrate protection against SQL injection by using Laravel's normal parameterised database mechanisms rather than constructing raw SQL using untrusted input.

---

5. Task 3 – Database Design
   Create the necessary MySQL database tables.
   Campaigns
   Create a campaigns table containing at least:
   • id
   • name
   • subject
   • body
   • recipient_count
   • status
   • created_at
   • updated_at
   Campaign status should support(use enums for this):
   • queued
   • processing
   • done
   Email Jobs
   Create an email_jobs table containing at least:
   • id
   • campaign_id
   • recipient_email
   • status
   • created_at
   • updated_at
   Email job status should support(use enums):
   • pending
   • sent
   • failed
   Establish the appropriate relationship between campaigns and email jobs.

---

6. Task 4 – Queue the Emails
   When a campaign is successfully submitted:
1. Create the campaign record.
1. Create one email job for each recipient.
1. Set each email job to pending.
1. Set the campaign status to queued.
   For example, if a campaign contains 100 recipients:
   • 1 campaign record should be created.
   • 100 email job records should be created.
   The creation of the campaign and its email jobs should be handled appropriately so that incomplete data is not left in the database if something goes wrong.

---

7. Task 5 – Process Emails
   Create a Laravel queued job/worker to process the email jobs.
   The worker should:
   • Find pending email jobs.
   • Process them individually.
   • Process jobs in FIFO order where practical.
   • Simulate sending the email rather than requiring a real email service.
   • Update the email job status to sent when successfully processed.
   • Update the campaign status appropriately.
   • Log useful information about processing.
   • Handle an individual job failure without bringing down the entire worker.
   For example:
   Processing campaign 1
   Processing email: email1@test.com
   Email sent successfully
   Processing email: email2@test.com
   Email sent successfully
   Campaign 1 completed
   You do not need to integrate with an external email provider.

---

8. Task 6 – Campaign API
   Create an endpoint that allows the Angular application to retrieve submitted campaigns.
   GET
   GET /api/campaigns
   The response should provide enough information for the front end to display a campaign list.
   For example:
   [
   {
   "id": 1,
   "name": "Spring Sale",
   "subject": "50% Off This Weekend!",
   "recipient_count": 25,
   "status": "processing",
   "created_at": "2026-10-08 10:30:00"
   }
   ]
   You may implement pagination if you feel it is appropriate, but this is not mandatory.

---

9. Task 7 – Angular Campaign Creation
   Create a simple Angular front end that allows a marketing user to create a campaign.
   The user should be able to enter:
   • Campaign name
   • Subject
   • Email body
   • Recipient email addresses
   For recipient emails, you may use a simple implementation such as:
   • One email per line in a textarea, or
   • An input where individual email addresses can be added.
   The Angular form should:
   • Validate required fields.
   • Validate email addresses.
   • Prevent duplicate email addresses.
   • Display clear validation messages.
   • Submit the campaign to the Laravel API.
   • Display a success message after submission.
   • Display the campaign ID and recipient count returned by the API.
   • Display meaningful validation errors returned by the API.
   The front end should not use hard-coded campaign data.
   It must communicate with the Laravel API.

---

10. Task 8 – Campaign List
    Create an Angular campaign list.
    The user should be able to view submitted campaigns in a simple table.
    Display at least:
    Field Description
    Campaign Campaign name
    Subject Email subject
    Recipients Number of recipients
    Status Queued / Processing / Done
    Created Date/time submitted
    The information must be retrieved from:
    GET /api/campaigns

---

11. Task 9 – Campaign Details
    Allow the user to select a campaign and view additional information.
    The campaign detail view should display:
    • Campaign name
    • Subject
    • Body
    • Number of recipients
    • Campaign status
    • Date created
    • Recipient email addresses
    • Individual email status
    For example:
    Recipient Status
    john@test.com
    Sent
    mary@test.com
    Sent
    peter@test.com
    Pending
    You should create an appropriate API endpoint to support this functionality.
    For example:
    GET /api/campaigns/{id}

---

12. Task 10 – Front-End User Experience
    The application does not need to have a sophisticated or highly polished design.
    However, demonstrate basic front-end development practices.
    The application should include:
    • Basic responsive layout.
    • Loading state while API requests are processing.
    • Success feedback after submitting a campaign.
    • Clear validation messages.
    • Appropriate API error handling.
    • An appropriate empty state when there are no campaigns.
    • Basic navigation between creating a campaign and viewing campaigns.
    The focus is on functionality and code quality rather than visual design.

---

13. Task 11 – Automated Tests
    Create automated tests using PHPUnit/Laravel's testing functionality.
    At a minimum, test:
    Campaign submission
    • A valid campaign can be submitted.
    • A campaign is stored correctly.
    Validation
    • Missing required fields are rejected.
    • Invalid email addresses are rejected.
    • Duplicate email addresses are rejected.
    Email jobs
    • Email jobs are created for each recipient.
    • The correct campaign is associated with each job.
    Queue/Worker
    • A queued email job can be processed.
    • The email job status is updated appropriately.
    • A failed job is handled appropriately.
    You do not need to achieve 100% code coverage.
    We are interested in seeing that you understand what should be tested and why.

---

14. Security Requirements
    The solution should demonstrate basic secure development practices.
    In particular:
    • Do not construct SQL queries using untrusted user input.
    • Use Laravel's validation mechanisms.
    • Do not expose unnecessary database information through the API.
    • Do not commit passwords, API keys or other secrets to the repository.
    • Use appropriate HTTP response codes.
    • Handle invalid API requests appropriately.

---

15. Code Quality
    We will consider:
    • Clear and logical code structure.
    • Appropriate Laravel conventions.
    • Appropriate Angular/TypeScript conventions.
    • Meaningful naming.
    • Separation of responsibilities.
    • Reusable components/services where appropriate.
    • Appropriate error handling.
    • Readable and maintainable code.
    • PSR-12 compliance on the PHP side.
    The solution does not need to be over-engineered.
    We would rather see a simple, well-structured solution than an unnecessarily complicated one.

---

16. What We Are Looking For
    This is an assessment for an Intermediate Full Stack Developer.
    We are looking for evidence that you can work comfortably across both the backend and frontend.
    In particular, we will assess:
    Backend
    • Laravel knowledge
    • REST API development
    • Database design
    • Eloquent relationships
    • Validation
    • Queues/jobs
    • Error handling
    • Testing
    • Basic security awareness
    Front End
    • Angular fundamentals
    • TypeScript
    • Components
    • Forms and validation
    • Services
    • API integration
    • Handling API responses/errors
    • Basic state/status handling
    • Clean, maintainable code
    Full Stack
    Most importantly, we want to see that you can connect the different parts of the application and build something that works end-to-end.

---

17. Submission Requirements
    Please submit:
1. Source code for the Laravel application.
1. Source code for the Angular application.
1. Database migrations.
1. Automated tests.
1. A README containing:
   o Installation instructions.
   o Environment/setup requirements.
   o Database setup instructions.
   o How to run the Laravel application.
   o How to run the Angular application.
   o How to run the queue/worker.
   o How to run the automated tests.
   o Any assumptions or decisions you made.
   o Any functionality you were unable to complete.
   Please include a sample .env.example where appropriate, but do not include actual passwords, API keys or other secrets.

---

18. Time Limit
    You have 3 calendar days to complete the assessment.
    The assessment is designed to be completed outside normal working hours and is therefore intentionally limited in scope.
    You are not expected to spend more than approximately 8–12 hours on the exercise.
    If you run out of time, please prioritise the core functionality and clearly document anything that remains incomplete.
    We will take this into consideration when reviewing the submission.

---

19. Priorities
    If you need to prioritise your time, please work in this order:
    Priority 1 – Core functionality
    • Campaign API
    • Validation
    • Database
    • Email jobs
    • Queue/worker
    Priority 2 – Angular
    • Campaign creation form
    • API integration
    • Campaign list
    • Campaign details
    Priority 3 – Testing
    • Core automated tests
    • Validation tests
    • Queue/job tests
    Priority 4 – Refinement
    • Error handling
    • UI improvements
    • Additional functionality
    • Code refinements

---

Final Objective
The completed application should allow a user to:
Create a campaign → Validate it → Store it → Queue individual emails → Process the emails → Update statuses → View the campaign and email statuses through Angular.
The emphasis is on demonstrating practical intermediate-level full-stack development skills, sound technical judgement and the ability to produce clean, working code within a defined timeframe.
