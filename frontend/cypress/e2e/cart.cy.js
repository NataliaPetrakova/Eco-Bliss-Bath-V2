describe("Scénario fonctionnel - Panier", () => {
  beforeEach(() => {
    cy.loginByForm();
  });

  it("Ajouter un produit au panier", () => {
    cy.visit("/#/products/5");
    cy.contains("en stock").should("be.visible");
    cy.contains("Ajouter au panier").click();
    cy.contains("Mon panier").should("be.visible");
  });

  it("Le panier affiche la page commande", () => {
    cy.visit("/#/cart");
    cy.contains("Commande").should("be.visible");
    cy.contains("Panier").should("be.visible");
  });

  it("Valider une commande depuis le panier", () => {
    cy.visit("/#/products/5");
    cy.contains("en stock").should("be.visible");
    cy.contains("Ajouter au panier").click();
    // Sans cy.wait() pour tester si le timing est la cause
    cy.visit("/#/cart");
    cy.contains("Votre panier est vide").should("not.exist");
    cy.contains("Commande").should("be.visible");
  });
});
