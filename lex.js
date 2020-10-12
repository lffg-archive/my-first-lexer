const CHAR_MAP = {
  '0': 'int',
  '1': 'int',
  '2': 'int',
  '3': 'int',
  '4': 'int',
  '5': 'int',
  '6': 'int',
  '7': 'int',
  '8': 'int',
  '9': 'int',
  '+': 'op-addition',
  '-': 'op-substraction',
  '*': 'op-multiplication',
  '/': 'op-division',
  '(': 'group-start',
  ')': 'group-end',
  '\r': 'blank',
  '\n': 'blank',
  '\t': 'blank',
  ' ': 'blank'
};

function makeGroup(parent) {
  return {
    parent,
    children: []
  };
}

function lex(txt) {
  let currentGroup = makeGroup(null);
  let currentIntToken = null;

  for (const [index, char] of [...txt].entries()) {
    console.log({ index, char });
    const code = CHAR_MAP[char];

    if (!code) {
      throw new Error(`Invalid token \`${char}' at position ${index}.`);
    }

    if (code === 'int') {
      currentIntToken = (currentIntToken || '') + char;
      continue;
    } else if (currentIntToken !== null) {
      currentGroup.children.push({
        _type: 'int',
        value: currentIntToken
      });
      currentIntToken = null;
    }

    if (code === 'group-start') {
      currentGroup = makeGroup(currentGroup);
      continue;
    }

    if (code === 'group-end') {
      const finishedGroup = currentGroup;

      if (!finishedGroup.parent) {
        throw new Error(`Unexpected token \`)' at position ${index}.`);
      }

      currentGroup = finishedGroup.parent;
      currentGroup.children.push({
        _type: 'group',
        children: finishedGroup.children
      });
      continue;
    }

    currentGroup.children.push({
      _type: 'token',
      value: char
    });
  }

  return currentGroup;
}
