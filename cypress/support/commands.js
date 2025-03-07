Cypress.Commands.add("login", () => {
  cy.session('loggedIn', () => {
    cy.intercept("GET", "/Prod/api/employees").as("getEmployeesList");
    cy.visit("/Account/Login");
    cy.get("input#Username").type(Cypress.env("USERNAME_VALUE"));
    cy.get("input#Password").type(Cypress.env("PASSWORD"), { log: false });
    cy.contains("button", "Log In").click();
    cy.url().should("contain", "/Benefits");
    cy.wait("@getEmployeesList").its("response.statusCode").should("eq", 200);
    cy.get("header .navbar-brand")
      .should("be.visible")
      .and("have.text", "Paylocity Benefits Dashboard");
    });
});
