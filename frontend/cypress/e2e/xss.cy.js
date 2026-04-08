describe("Test faille XSS", () => {
  beforeEach(() => {
    cy.loginByForm();
    cy.visit("/#/reviews");
    cy.get('[data-cy="review-input-title"]', { timeout: 10000 }).should(
      "be.visible",
    );
  });

  it("Le script XSS ne doit pas être exécuté dans les commentaires", () => {
    cy.get('[data-cy="review-input-title"]').type("Test XSS");
    cy.get('[data-cy="review-input-comment"]').type(
      '<script>alert("XSS")</script>',
    );
    cy.get('[data-cy="review-submit"]').click();

    cy.on("window:alert", () => {
      throw new Error(
        "Faille XSS détectée : une popup alert a été déclenchée !",
      );
    });

    cy.get("app-reviews").should("not.contain", "<script>");
  });
});
