// Test de sécurité : vérifie que l'application est protégée contre les attaques XSS
describe("Test faille XSS", () => {
  // Avant le test : connexion, navigation vers la page avis, et attente que le formulaire soit prêt
  beforeEach(() => {
    cy.loginByForm(); // On se connecte via le formulaire
    cy.visit("/#/reviews"); // On navigue vers la page des avis
    cy.get('[data-cy="review-input-title"]', { timeout: 10000 }).should(
      "be.visible", // On attend que le champ titre soit visible (délai max 10s)
    );
  });

  // Test : vérifie qu'un script malveillant injecté dans un commentaire n'est pas exécuté
  it("Le script XSS ne doit pas être exécuté dans les commentaires", () => {
    cy.get('[data-cy="review-input-title"]').type("Test XSS"); // On saisit un titre normal
    cy.get('[data-cy="review-input-comment"]').type(
      '<script>alert("XSS")</script>', // On injecte un script malveillant dans le champ commentaire
    );
    cy.get('[data-cy="review-submit"]').click(); // On soumet le formulaire

    // Si une popup alert se déclenche, c'est que le script a été exécuté — le test doit échouer
    cy.on("window:alert", () => {
      throw new Error(
        "Faille XSS détectée : une popup alert a été déclenchée !",
      );
    });

    cy.get("app-reviews").should("not.contain", "<script>"); // La balise script ne doit pas apparaître dans le DOM
  });
});
