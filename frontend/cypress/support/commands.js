// Commande personnalisée pour se connecter via l'API
Cypress.Commands.add("loginByApi", () => {
  cy.fixture("credentials").then((credentials) => {
    cy.request("POST", "http://localhost:8081/login", {
      username: credentials.email,
      password: credentials.password,
    }).then((resp) => {
      window.localStorage.setItem("token", resp.body.token);
    });
  });
});

// Commande personnalisée pour se connecter via le formulaire
Cypress.Commands.add("loginByForm", () => {
  cy.fixture("credentials").then((credentials) => {
    cy.visit("/#/login");
    cy.get('[data-cy="login-input-username"]').type(credentials.email);
    cy.get('input[type="password"]').type(credentials.password);
    cy.get('[data-cy="login-submit"]').click();
    cy.contains("Déconnexion", { timeout: 10000 }).should("be.visible");
  });
});
