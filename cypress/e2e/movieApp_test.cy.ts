import { IMovie } from "../../src/ts/models/Movie";

beforeEach(() => {
  cy.visit("/");
});

describe("movieApp tests", () => {
  it("should show search application", () => {
    cy.get("form").should("contain.html", "input");
    cy.get("input").should("not.have.value");
  });

  it("should be able to type words in input", () => {
    let searchTerm: string = "Star";

    cy.get("input").type(searchTerm).should("have.value", searchTerm);
  });

  it("should get list of movies based on searchterm Star", () => {
    let searchTerm: string = "Star";

    cy.get("input").type(searchTerm).should("have.value", searchTerm);
    cy.get("#search").click();
    cy.get("#movie-container > .movie").should("have.length", 10);
    cy.get(".movie").should("contain.html", "h3");
    cy.get(".movie").should("contain.html", "img");
  });

  it("should show error message when input field is empty", () => {
    let searchTerm: string = "";

    cy.get("input").should("have.value", searchTerm);
    cy.get("#search").click();
    cy.get("#movie-container:first").contains("Inga sökresultat att visa");
  });

  it("should send GET request correctly", () => {
    let searchTerm: string = "Star";
    const interceptData: IMovie[] = [
      {
        Title: "Star Wars Episode I",
        imdbID: "idmbID",
        Type: "Sci-fi",
        Poster: "img.url",
        Year: "1998",
      },
      {
        Title: "Star Wars Episode II",
        imdbID: "idmbID",
        Type: "Sci-fi",
        Poster: "img.url",
        Year: "1999",
      },
    ];

    cy.intercept("GET", "http://omdbapi.com/*", { interceptData }).as(
      "movieCall"
    );

    cy.get("input").type(searchTerm).should("have.value", searchTerm);
    cy.get("#search").click();

    cy.wait("@movieCall").its("request.url").should("contain", "=Star");
  });

  it("should return interceptData", () => {
    let searchTerm: string = "Star";
    const interceptData: IMovie[] = [
      {
        Title: "Star Wars Episode I",
        imdbID: "idmbID",
        Type: "Sci-fi",
        Poster: "img.url",
        Year: "1998",
      },
      {
        Title: "Star Wars Episode II",
        imdbID: "idmbID",
        Type: "Sci-fi",
        Poster: "img.url",
        Year: "1999",
      },
    ];

    cy.intercept("GET", "http://omdbapi.com/*", { interceptData }).as(
      "movieCall"
    );

    cy.get("input").type(searchTerm).should("have.value", searchTerm);
    cy.get("#search").click();

    cy.wait("@movieCall").its("request.url").should("contain", "=Star");
  });

  it("should show error message when input field contains anything other than letters or numbers", () => {
    let searchTerm: string = "!!!";

    cy.get("input").type(searchTerm).should("have.value", searchTerm);
    cy.get("#search").click();
    cy.get("#movie-container:first").contains("Inga sökresultat att visa");
  });
});
