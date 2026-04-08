describe("Smoke Tests", () => {
  it("La page de connexion affiche les champs et le bouton", () => {
    cy.visit("/#/login");
    cy.get('[data-cy="login-input-username"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('[data-cy="login-submit"]').should("be.visible");
  });

  it('Le bouton "Ajouter au panier" est visible sur une fiche produit quand connecté', () => {
    cy.loginByForm();
    cy.visit("/#/products/5");
    cy.contains("Ajouter au panier").should("be.visible");
  });
});
