// Smoke Tests : vérifications rapides que les fonctionnalités essentielles sont opérationnelles
describe("Smoke Tests", () => {
  // Test 1 : vérifie que la page de connexion s'affiche correctement
  it("La page de connexion affiche les champs et le bouton", () => {
    cy.visit("/#/login");
    cy.get('[data-cy="login-input-username"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('[data-cy="login-submit"]').should("be.visible");
  });

  // Test 2 : vérifie que le bouton d'ajout au panier est présent sur une fiche produit
  it('Le bouton "Ajouter au panier" est visible sur une fiche produit quand connecté', () => {
    cy.loginByForm();
    cy.visit("/#/products/5");
    cy.contains("Ajouter au panier").should("be.visible");
  });

  // Test 3 : vérifie que la page d'accueil se charge correctement
  it("La page d'accueil se charge correctement", () => {
    cy.visit("/#/");
    cy.contains("Produits").should("be.visible");
    cy.contains("Avis").should("be.visible");
    cy.contains("Connexion").should("be.visible");
  });

  // Test 4 : vérifie que la navigation vers la page produits fonctionne
  it("La page produits est accessible depuis le menu", () => {
    cy.visit("/#/");
    cy.contains("Produits").click();
    cy.url().should("include", "/products");
    cy.get("body").should("be.visible");
  });

  // Test 5 : vérifie que la liste des produits s'affiche
  it("La liste des produits s'affiche sur la page produits", () => {
    cy.visit("/#/products");
    cy.contains("Produits").should("be.visible");
    cy.get("body").should("not.contain", "Aucun produit");
  });

  // Test 6 : vérifie que le bouton Connexion est visible depuis l'accueil
  it("Le bouton Connexion est visible depuis la page d'accueil", () => {
    cy.visit("/#/");
    cy.contains("Connexion").should("be.visible");
    cy.contains("Inscription").should("be.visible");
  });

  // Test 7 : vérifie que la page Avis est accessible
  it("La page Avis est accessible depuis le menu", () => {
    cy.visit("/#/");
    cy.contains("Avis").click();
    cy.url().should("include", "/reviews");
    cy.get("body").should("be.visible");
  });
});
