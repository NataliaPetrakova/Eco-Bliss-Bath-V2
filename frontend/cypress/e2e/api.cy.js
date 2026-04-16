const baseUrl = "http://localhost:8081";
const credentials = {
  username: "test2@test.fr",
  password: "testtest",
};

describe("Tests API", () => {
  let token;

  beforeEach(() => {
    cy.request("POST", `${baseUrl}/login`, credentials).then((resp) => {
      token = resp.body.token;
    });
  });

  // Test 1 : vérifie que l'accès sans token est bien refusé
  it("GET /orders sans token doit retourner 401", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders`,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(401);
    });
  });

  // Test 2 : vérifie que l'API retourne 401 et non 403 avec un token invalide
  it("GET /orders avec token invalide doit retourner 401 et non 403", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders`,
      headers: {
        Authorization: "Bearer tokeninvalide123",
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(401);
      expect(resp.status).to.not.eq(403);
    });
  });

  // Test 3 : vérifie que la liste des commandes est accessible avec un token valide
  it("GET /orders connecté doit retourner 200", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });

  // Test 4 : vérifie que la fiche du produit #3 contient bien les champs attendus
  it("GET /products/{id} doit retourner la fiche produit", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/products/3`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("name");
      expect(resp.body).to.have.property("price");
    });
  });

  // Test 5 : vérifie qu'un utilisateur inconnu ne peut pas se connecter
  it("POST /login utilisateur inconnu doit retourner 401", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/login`,
      body: { username: "inconnu@test.fr", password: "wrongpassword" },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(401);
    });
  });

  // Test 6 : vérifie qu'un utilisateur valide peut se connecter et reçoit un token
  it("POST /login utilisateur connu doit retourner 200", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/login`,
      body: credentials,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("token");
    });
  });

  // Test 7 : vérifie qu'on peut ajouter un produit disponible au panier
  it("PUT /orders/add doit ajouter un produit disponible au panier", () => {
    cy.request({
      method: "PUT",
      url: `${baseUrl}/orders/add`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        product: "/api/products/3",
        quantity: 1,
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });

  // Test 8 : vérifie qu'on ne peut pas ajouter un produit en rupture de stock
  it("PUT /orders/add produit en rupture de stock doit retourner une erreur", () => {
    cy.request({
      method: "PUT",
      url: `${baseUrl}/orders/add`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        product: "/api/products/4",
        quantity: 1,
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.not.eq(200);
    });
  });

  // Test 9 : vérifie que l'accès sans token retourne 401 et non 403
  // Anomalie relevée par Marie
  it("GET /orders sans token retourne 401 et non 403", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders`,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(401);
      expect(resp.status).to.not.eq(403);
    });
  });

  // Test 10 : vérifie que la route d'ajout au panier utilise PUT et non POST
  it("PUT /orders/add utilise PUT et non POST", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/orders/add`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        product: "/api/products/3",
        quantity: 1,
      },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.not.eq(200);
    });
  });

  // Test 11 : vérifie que l'ID 1 n'existe pas en BDD
  it("GET /products/1 doit retourner 404 - ID inexistant en BDD", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/products/1`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404);
    });
  });

  // Test 12 : vérifie qu'un utilisateur connecté peut poster un avis
  it("POST /reviews doit ajouter un avis", () => {
    cy.request({
      method: "POST",
      url: `${baseUrl}/reviews`,
      headers: { Authorization: `Bearer ${token}` },
      body: {
        title: "Super produit",
        comment: "Très bon savon !",
        rating: 5,
      },
    }).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });
});
