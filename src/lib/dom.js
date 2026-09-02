export function createElement(tagName, options = {}, children = []) {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text) {
    element.textContent = options.text;
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        element.setAttribute(name, String(value));
      }
    });
  }

  if (options.dataset) {
    Object.entries(options.dataset).forEach(([name, value]) => {
      element.dataset[name] = String(value);
    });
  }

  if (options.props) {
    Object.assign(element, options.props);
  }

  appendChildren(element, children);
  return element;
}

export function appendChildren(parent, children) {
  children.flat().filter(Boolean).forEach((child) => {
    if (typeof child === "string") {
      parent.append(document.createTextNode(child));
      return;
    }

    parent.append(child);
  });

  return parent;
}
