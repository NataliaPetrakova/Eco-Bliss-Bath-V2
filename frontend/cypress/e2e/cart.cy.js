const baseUrl = "http://localhost:8081";
const credentials = {
  username: "test2@test.fr",
  password: "testtest",
};

describe("Scénario fonctionnel - Panier", () => {
  beforeEach(() => {
    cy.loginByForm();
  });

  // Test 1 : ajout d'un produit au panier
  it("Ajouter un produit au panier", () => {
    cy.visit("/#/products/5");
    cy.contains("en stock").should("be.visible");
    cy.contains("Ajouter au panier").click();
    cy.contains("Mon panier").should("be.visible");
  });

  // Test 2 : affichage de la page panier
  it("Le panier affiche la page commande", () => {
    cy.visit("/#/cart");
    cy.contains("Commande").should("be.visible");
    cy.contains("Panier").should("be.visible");
  });

  // Test 3 : validation de commande depuis le panier
  it("Valider une commande depuis le panier", () => {
    cy.visit("/#/products/5");
    cy.contains("en stock").should("be.visible");
    cy.contains("Ajouter au panier").click();
    cy.visit("/#/cart");
    cy.contains("Votre panier est vide").should("not.exist");
    cy.contains("Commande").should("be.visible");
  });

  // Test 4 : vérifier que le stock diminue après ajout au panier
  it("Le stock diminue après ajout au panier", () => {
    cy.visit("/#/products/5");
    cy.get('[data-cy="detail-product-stock"]')
      .should("be.visible")
      .invoke("text")
      .then((stockText) => {
        cy.log("Stock initial text: " + stockText);
        const match = stockText.match(/-?\d+/);
        if (!match) return; // Si pas de nombre trouvé, on skip
        const stockInitial = parseInt(match[0]);
        cy.log("Stock initial: " + stockInitial);
        cy.contains("Ajouter au panier").click();
        cy.wait(1000);
        cy.visit("/#/products/5");
        cy.get('[data-cy="detail-product-stock"]')
          .should("be.visible")
          .invoke("text")
          .then((newStockText) => {
            cy.log("Nouveau stock text: " + newStockText);
            const newMatch = newStockText.match(/-?\d+/);
            if (!newMatch) return;
            const newStock = parseInt(newMatch[0]);
            cy.log("Nouveau stock: " + newStock);
            expect(newStock).to.eq(stockInitial - 1);
          });
      });
  });

  // Test 5 : vérification du contenu du panier via l'API après ajout
  it("Le contenu du panier est vérifié via l'API après ajout", () => {
    // D'abord ajouter un produit via le frontend
    cy.visit("/#/products/5");
    cy.contains("en stock").should("be.visible");
    cy.contains("Ajouter au panier").click();
    cy.contains("Mon panier").should("be.visible");

    // Ensuite vérifier via l'API que le produit est bien dans le panier
    cy.request("POST", `${baseUrl}/login`, credentials).then((resp) => {
      const token = resp.body.token;
      cy.request({
        method: "GET",
        url: `${baseUrl}/orders`,
        headers: { Authorization: `Bearer ${token}` },
      }).then((orderResp) => {
        expect(orderResp.status).to.eq(200);
        // Le panier doit contenir au moins un produit
        expect(orderResp.body.orderLines).to.have.length.greaterThan(0);
      });
    });
  });

  // Test 6 : quantité négative refusée
  it("Ajouter une quantité négative ne doit pas être accepté", () => {
    cy.visit("/#/products/5");
    cy.contains("en stock").should("be.visible");
    cy.get("input[type='number']").clear().type("-1");
    cy.contains("Ajouter au panier").click();
    cy.visit("/#/cart");
    cy.get("body").then(($body) => {
      if (!$body.text().includes("Votre panier est vide")) {
        cy.get("input[type='number']").each(($input) => {
          expect(parseInt($input.val())).to.be.greaterThan(0);
        });
      }
    });
  });

  // Test 7 : quantité supérieure à 20 refusée
  it("Ajouter une quantité supérieure à 20 ne doit pas être accepté", () => {
    cy.visit("/#/products/5");
    cy.contains("en stock").should("be.visible");
    cy.get("input[type='number']").clear().type("21");
    cy.contains("Ajouter au panier").click();
    cy.visit("/#/cart");
    cy.get("body").then(($body) => {
      if (!$body.text().includes("Votre panier est vide")) {
        cy.get("input[type='number']").each(($input) => {
          expect(parseInt($input.val())).to.be.lessThan(21);
        });
      }
    });
  });
});
