import {
  parseErrors,
  parseYaml,
  validate
} from './test-utils';


describe('Validate stickers.yml', () => {
  test('Ensure stickers.yml is valid YAML.', () => {
    expect(() => {
      parseYaml('./stickers.yml');
    }).not.toThrow();
  });

  test('Ensure stickers.yml adheres to our schema.', () => {
    const parsedYaml = parseYaml('./stickers.yml');
    const isValid = validate(parsedYaml);

    if (!isValid) {
      fail(new Error(parseErrors(parsedYaml)));
    }
  });
});
