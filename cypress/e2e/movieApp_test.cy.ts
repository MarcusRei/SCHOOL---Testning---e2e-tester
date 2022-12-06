import { IMovie } from "../../src/ts/models/Movie";

describe("movieApp tests", () => {
  it("should type out words in input", () => {
    let searchTerm: string = "Star";
    cy.visit("http://localhost:1234");

    cy.get("input").type(searchTerm).should("have.value", searchTerm);
  });

  it("should get list of movies based on searchterm Star", () => {
    let searchTerm: string = "Star";
    cy.visit("http://localhost:1234");

    cy.get("input").type(searchTerm).should("have.value", searchTerm);
    cy.get("#search").click();
    cy.get("#movie-container > .movie").should("have.length", 10);
  });

  it("should show error message when input field is empty", () => {
    let searchTerm: string = "";
    cy.visit("http://localhost:1234");

    cy.get("input").should("have.value", searchTerm);
    cy.get("#search").click();
    cy.get("#movie-container:first").should(
      "contain.text",
      "Inga sökresultat att visa"
    );
  });

  it("should get intercept-data", () => {
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

    cy.visit("http://localhost:1234");

    cy.intercept("GET", "http://omdbapi.com/*", { interceptData }).as(
      "movieCall"
    );

    cy.get("input").type(searchTerm).should("have.value", searchTerm);
    cy.get("#search").click();

    cy.wait("@movieCall").its("request.url").should("contain", "omdbapi");
  });
});
