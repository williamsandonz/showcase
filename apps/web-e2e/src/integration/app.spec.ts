import { getGreeting } from '../support/app.po';

describe('web', () => {
  beforeEach(() => cy.visit('/'));

  it('should display home', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Home');
  });
});
