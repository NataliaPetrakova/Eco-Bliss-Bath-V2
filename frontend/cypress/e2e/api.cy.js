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

  it("GET /orders sans token doit retourner 401", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders`,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(401);
    });
  });

  it("GET /orders connecté doit retourner 200", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/orders`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    }).then((resp) => {
      // Bug connu : retourne 404 au lieu de 200
      expect(resp.status).to.eq(200);
    });
  });

  it("GET /products/{id} doit retourner la fiche produit", () => {
    cy.request({
      method: "GET",
      url: `${baseUrl}/products/1`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    }).then((resp) => {
      // Bug connu : retourne 404 au lieu de 200
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property("name");
      expect(resp.body).to.have.property("price");
    });
  });

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

  it("PUT /orders/add doit ajouter un produit au panier", () => {
    cy.request({
      method: "PUT",
      url: `${baseUrl}/orders/add`,
      headers: { Authorization: `Bearer ${token}` },
      body: { product: "/api/products/1", quantity: 1 },
      failOnStatusCode: false,
    }).then((resp) => {
      // Bug connu : retourne 400 au lieu de 200
      expect(resp.status).to.eq(200);
    });
  });

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
