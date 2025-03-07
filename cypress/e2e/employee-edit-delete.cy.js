describe("Edit and Delete existing employee", () => {
  let employeeId;
  let currentTime;
  let firstName;
  let lastName;
  let noOfDependents;

  beforeEach(() => {
    currentTime = new Date().getTime();
    firstName = `Cypress ${currentTime}`;
    lastName = "Doe";
    noOfDependents = 1;
    cy.request({
      method: "POST",
      url: "/api/employees/",
      headers: {
        Authorization: Cypress.env("AUTH_TOKEN"),
      },
      body: {
        firstName,
        lastName,
        dependants: noOfDependents,
      },
    }).then((resp) => {
      employeeId = resp.body.id;
      expect(resp.status).to.eq(200);
    });
    cy.intercept("GET", "/Prod/api/employees").as("getEmployeesList");
    cy.login();
    cy.visit("/");
    cy.wait("@getEmployeesList").its("response.statusCode").should("eq", 200);
  });

  afterEach(() => {
    cy.request({
      method: "DELETE",
      url: `/api/employees/${employeeId}`,
      headers: {
        Authorization: Cypress.env("AUTH_TOKEN"),
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });

  it("should be able to edit existing employee", () => {
    const firstNameNodified = `John ${currentTime}`;
    const lastNameModified = "Wick";
    const noOfDependentsModified = 3;
    cy.intercept("GET", "/Prod/api/employees").as("getEmployeesList");
    cy.intercept("PUT", "/Prod/api/employees").as("editEmployee");

    cy.log("**Edit existing employee**");
    cy.get("table#employeesTable").within(() => {
      cy.contains("tr", firstName).as("employeeRow");
    });
    cy.get("@employeeRow").scrollIntoView().should("be.visible");
    cy.get("@employeeRow").find(".fa-edit").click();
    cy.get("div#employeeModal").within(() => {
      cy.get(".modal-title")
        .should("be.visible")
        .and("have.text", "Add Employee"); // BUG: update text once fixed
      cy.get("input#firstName").should("have.value", firstName);
      cy.get("input#lastName").should("have.value", lastName);
      cy.get("input#dependants").should("have.value", noOfDependents);

      cy.get("input#firstName").clear().type(firstNameNodified);
      cy.get("input#lastName").clear().type(lastNameModified);
      cy.get("input#dependants").clear().type(noOfDependentsModified);
      cy.get("button#updateEmployee").click();
    });
    cy.wait("@editEmployee").its("response.statusCode").should("eq", 200);
    cy.wait("@getEmployeesList").its("response.statusCode").should("eq", 200);

    cy.log("**Check edited employee properly updated with all the values**");

    cy.get("table#employeesTable").within(() => {
      cy.contains('tr', firstName).should('not.exist')
      cy.contains("tr", firstNameNodified).as("employeeRowModified");
    });
    cy.get("@employeeRowModified").scrollIntoView().should("be.visible");
    cy.get("@employeeRowModified")
      .find("td")
      .eq(1)
      .should("have.text", firstNameNodified);
    cy.get("@employeeRowModified")
      .find("td")
      .eq(2)
      .should("have.text", lastNameModified);
    cy.get("@employeeRowModified")
      .find("td")
      .eq(3)
      .should("have.text", noOfDependentsModified);
  });

  it("should be able to delete existing employee", () => {
    cy.intercept("GET", "/Prod/api/employees").as("getEmployeesList");
    cy.intercept("DELETE", `/Prod/api/employees/${employeeId}`).as("deleteEmployee");

    cy.get("table#employeesTable").within(() => {
      cy.contains("tr", firstName).as("employeeRow");
    });
    cy.get("@employeeRow").scrollIntoView().should("be.visible");
    cy.get("@employeeRow").find(".fa-times").click();
    cy.get("div#deleteModal").within(() => {
      cy.get(".modal-title")
        .should("be.visible")
        .and("have.text", "Delete Employee");
      cy.get('.modal-body').within(() => {
        cy.contains('Delete employee record for').should('be.visible')
        cy.contains('span#deleteFirstName', firstName).should('be.visible')
        cy.contains('span#deleteLastName', lastName).should('be.visible')
      })
      cy.get("button#deleteEmployee").click();
    });
    cy.wait("@deleteEmployee").its("response.statusCode").should("eq", 200);
    cy.wait("@getEmployeesList").its("response.statusCode").should("eq", 200);

    cy.log("**Check deleted employee not present anymore**");
    cy.get("table#employeesTable").within(() => {
      cy.contains('tr', firstName).should('not.exist')
    });
  });
});
