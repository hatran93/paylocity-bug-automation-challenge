# paylocity-bug-automation-challenge

## API tests
For API tests I used Postman to create a collection of tests. The collection is exported as a JSON file (**API-Paylocity.postman_collection.json**) in `postman` folder (in the root of the repository)
Collection contains 2 main folders - `Happy flows` tests and `Negative scenarios`. Total 87 tests, takes around 25s to execute

**How to run:** Import the collection to Postman and run the whole collection  
**Note:** I passed the authorization key to the top parent folder --> all the subsequent requests just inherits from them. In real life I would have the token saved as a secret variable in Github / Gitlab and passed the value as a variable when executing with newman.

![Postman tests structure](<assets/images/postman-structure.png>)

## UI tests
For UI tests I used Cypress with Javascript as from what I understood is the company's main test framework.
I covered the main scenario - add new employee, editing existing employee and deleting employee.

Initially, I thought of having a one big E2E test flow where all these would be covered.
- this is easier and faster to implement
- downsides: test file could become too big, more difficult to read & maintain. Also, if some step fails (p.e. adding new employee), editing and deleting won't be executed.

In the end, I decided to have them as separate independant tests (2 spec files in `cypress/e2e` folder)
- took longer to implement
- in long-term I think it's more efficient as you can test each function independently
- challenging part was to prepare the data (creating new employee) before test execution and also to have teardown to delete it --> all is done as API calls

I created one custom command for `login` and wrapped it in cy.session() --> to save time with login for edit and delete tests
For credentials (username, password and auth token) I used `.env` package --> to run you have to create a `.env` file in the root of the project with correct values
I did not need to use fixtures to read / mock some data but left the folder there as in real projects it's commonly used.

**How to run:** `npx cypress open` to open cypress in UI mode and run the specs, or `npx cypress run` to run in headless mode
