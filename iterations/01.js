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
  ')': 'group-end'
};

function makeGroup(parent) {
  return {
    parent,
    children: []
  };
}

function lex(txt) {
  let currentGroup = makeGroup(null);

  for (const [index, char] of Object.entries(txt)) {
    const code = CHAR_MAP[char];

    if (!code) {
      throw new Error(`Invalid token \`${char}' at position ${index}.`);
    }

    if (code === 'group-start') {
      if (currentGroup.children.length === 0) {
        continue;
      }

      currentGroup = makeGroup(currentGroup);
      continue;
    }

    if (code === 'group-end') {
      if (currentGroup.children.length === 0) {
        continue;
      }

      const finishedGroup = currentGroup;
      currentGroup = finishedGroup.parent;
      currentGroup.children.push({
        type: 'group',
        children: finishedGroup.children
      });
      continue;
    }

    currentGroup.children.push({
      type: 'token',
      value: char
    });
  }

  return currentGroup;
}
