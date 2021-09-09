describe('Audio Player', () => {
  it('Plays audio', () => {
    cy.visit('/');
    cy.get('.composition-item:first').click();
    cy.wait(5000);
    cy.get('#play-button').click();
    cy.wait(10000);
    cy.get('#player-play-button').click();
  });
});
