describe("Add new employee", () => {
  let employeeId;
  let currentTime;

  beforeEach(() => {
    currentTime = new Date().getTime();
    cy.intercept("GET", "/Prod/api/employees").as("getEmployeesList");
    cy.login();
    cy.visit("/");
    cy.wait("@getEmployeesList").its("response.statusCode").should("eq", 200);
  });

  after(() => {
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

  it("should be able to add new employee", () => {
    const firstName = `Cypress ${currentTime}`;
    const lastName = "Doe";
    const noOfDependents = 3;
    cy.intercept("GET", "/Prod/api/employees").as("getEmployeesList");
    cy.intercept("POST", "/Prod/api/employees").as("addNewEmployee");
    cy.get("button#add").click();

    cy.log("**Fill employee details and Save**");
    cy.get("div#employeeModal").within(() => {
      cy.get(".modal-title")
        .should("be.visible")
        .and("have.text", "Add Employee");
      cy.get("input#firstName").type(firstName);
      cy.get("input#lastName").type(lastName);
      cy.get("input#dependants").type(noOfDependents);
      cy.get("button#addEmployee").click();
      cy.wait("@addNewEmployee").its("response.statusCode").should("eq", 200);
      cy.get("@addNewEmployee").then((xhr) => {
        employeeId = xhr.response.body.id;
      });
      cy.wait("@getEmployeesList").its("response.statusCode").should("eq", 200);
    });

    cy.log("**Check new employee properly created with all the values**");
    cy.get("table#employeesTable").within(() => {
      cy.contains("tr", firstName).as("newlyAddedEmployee");
      cy.get("@newlyAddedEmployee").scrollIntoView().should("be.visible");
      cy.get("@newlyAddedEmployee")
        .find("td")
        .eq(2)
        .should("have.text", lastName);
      cy.get("@newlyAddedEmployee")
        .find("td")
        .eq(3)
        .should("have.text", noOfDependents);
    });
  });
});
