describe("About page", () => {
  before(() => {
    cy.signup("someone@example.com", "password");
  });

  it("logs the user out", () => {
    cy.visit("/login");
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    cy.visit("/about");
    cy.get("#about-logout-button").click();
    cy.url().should("include", "/login");
  });

  it("redirects user to the feed page from the dropdown menu", () => {
    cy.visit("/login");
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    cy.visit("/about");
    cy.get("#feed-button").click();
    cy.url().should("include", "/posts");
  });

  it("redirects user to the feed page from the logo", () => {
    cy.visit("/login");
    cy.get("#email").type("someone@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    cy.visit("/about");
    cy.get("#logo-link").click();
    cy.url().should("include", "/posts");
  });
});
