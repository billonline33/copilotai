describe("To-Do App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("displays initial tasks", () => {
    cy.contains("Sample Task 1");
    cy.contains("Sample Task 2");
  });

  it("can add a new task", () => {
    cy.get('input[placeholder="Add a new task"]').type("Test new task");
    cy.contains("Add").click();
    cy.contains("Test new task");
  });

  it("can mark a task as completed", () => {
    cy.contains("Sample Task 1")
      .parent()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.contains("Sample Task 1")
      .parent()
      .find('input[type="checkbox"]')
      .should("be.checked");
  });

  it("can delete a task", () => {
    cy.contains("Sample Task 2")
      .parent()
      .find("button")
      .contains("Delete")
      .click();
    cy.contains("Sample Task 2").should("not.exist");
  });
});
