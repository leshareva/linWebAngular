import { LeanWebPage } from './app.po';

describe('lean-web App', function() {
  let page: LeanWebPage;

  beforeEach(() => {
    page = new LeanWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
