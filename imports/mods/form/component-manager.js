import { addComponent, getComponent } from '../tree/base/type-db';

export const DEFAULT_TYPE = 'default';

class ComponentManager {
  types = {};

  registerComponent(type, component) {
    addComponent(component, type, 'react form');
  }

  getComponent(type, form) {
    // if form present
    return form
      ? form.component || getComponent(form.type || type || DEFAULT_TYPE, ['react', 'form'])
      : getComponent(type || DEFAULT_TYPE, ['react', 'form']);
  }
}

const componentManager = new ComponentManager();
export default componentManager;
