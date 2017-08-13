import { ZhixiTPCPage } from './app.po';

describe('zhixi-t-pc App', function() {
  let page: ZhixiTPCPage;

  beforeEach(() => {
    page = new ZhixiTPCPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
