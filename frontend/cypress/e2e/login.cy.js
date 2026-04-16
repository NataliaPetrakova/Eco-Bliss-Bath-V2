describe("Scénario fonctionnel - Connexion", () => {
  beforeEach(() => {
    cy.visit("/#/login");
  });

  // Test 1 : vérifie que tous les éléments du formulaire sont bien affichés
  it("La page de connexion affiche bien le formulaire", () => {
    cy.get('[data-cy="login-input-username"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('[data-cy="login-submit"]').should("be.visible");
  });

  // Test 2 : vérifie qu'un utilisateur valide peut se connecter
  it("Connexion réussie avec des identifiants valides", () => {
    cy.fixture("credentials").then((credentials) => {
      cy.get('[data-cy="login-input-username"]').type(credentials.email);
      cy.get('input[type="password"]').type(credentials.password);
      cy.get('[data-cy="login-submit"]').click();
      cy.contains("Déconnexion", { timeout: 10000 }).should("be.visible");
      cy.contains("Mon panier").should("be.visible");
    });
  });

  // Test 3 : vérifie qu'un utilisateur avec de mauvais identifiants reste sur /login
  it("Connexion échouée avec des identifiants invalides", () => {
    cy.get('[data-cy="login-input-username"]').type("mauvais@email.fr");
    cy.get('input[type="password"]').type("mauvaismdp");
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should("include", "/login");
  });

  // Test 4 : vérifie que la déconnexion fonctionne correctement
  it("Déconnexion réussie", () => {
    cy.fixture("credentials").then((credentials) => {
      cy.get('[data-cy="login-input-username"]').type(credentials.email);
      cy.get('input[type="password"]').type(credentials.password);
      cy.get('[data-cy="login-submit"]').click();
      cy.contains("Déconnexion", { timeout: 10000 }).should("be.visible");
      cy.contains("Déconnexion").click();
      // Après déconnexion, on doit voir les boutons Connexion et Inscription
      cy.contains("Connexion").should("be.visible");
      cy.contains("Inscription").should("be.visible");
    });
  });

  // Test 5 : vérifie que le formulaire bloque la soumission avec un email vide
  it("Connexion avec email vide ne doit pas être acceptée", () => {
    cy.get('input[type="password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    // On doit rester sur la page login
    cy.url().should("include", "/login");
  });

  // Test 6 : vérifie que le formulaire bloque la soumission avec un mot de passe vide
  it("Connexion avec mot de passe vide ne doit pas être acceptée", () => {
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-submit"]').click();
    // On doit rester sur la page login
    cy.url().should("include", "/login");
  });

  // Test 7 : vérifie que le formulaire bloque un format d'email invalide
  it("Connexion avec format email invalide ne doit pas être acceptée", () => {
    cy.get('[data-cy="login-input-username"]').type("cecinestpasun email");
    cy.get('input[type="password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    // On doit rester sur la page login
    cy.url().should("include", "/login");
  });
});
