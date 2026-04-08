describe("Scénario fonctionnel - Connexion", () => {
  beforeEach(() => {
    cy.visit("/#/login");
  });

  it("La page de connexion affiche bien le formulaire", () => {
    cy.get('[data-cy="login-input-username"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('[data-cy="login-submit"]').should("be.visible");
  });

  it("Connexion réussie avec des identifiants valides", () => {
    cy.fixture("credentials").then((credentials) => {
      cy.get('[data-cy="login-input-username"]').type(credentials.email);
      cy.get('input[type="password"]').type(credentials.password);
      cy.get('[data-cy="login-submit"]').click();
      cy.contains("Déconnexion", { timeout: 10000 }).should("be.visible");
      cy.contains("Mon panier").should("be.visible");
    });
  });

  it("Connexion échouée avec des identifiants invalides", () => {
    cy.get('[data-cy="login-input-username"]').type("mauvais@email.fr");
    cy.get('input[type="password"]').type("mauvaismdp");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("include", "/login");
  });
});
