import { NgCanvasPage } from './app.po';

describe('ng-canvas App', () => {
  let page: NgCanvasPage;

  beforeEach(() => {
    page = new NgCanvasPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
