import Model, { attr } from '@ember-data/model';

export default class PageModel extends Model {
  @attr('tribe-modules') modules;
}
