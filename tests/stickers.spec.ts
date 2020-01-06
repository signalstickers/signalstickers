import Ajv from 'ajv';


/**
 * JSON Schema for stickers.json.
 */
const schema = {
  type: 'object',
  patternProperties: {
    '^[\\d\\w]+$': {
      type: 'object',
      properties: {
        key: {
          type: 'string'
        },
        source: {
          type: 'string'
        },
        tags: {
          type: 'string'
        },
        nsfw: {
          type: 'boolean'
        }
      },
      additionalProperties: false,
      required: [
        'key'
      ]
    }
  }
};


describe('stickers.json', () => {
  let stickersJson: any;

  // This will throw if there are any syntax errors in the file.
  it('should be able to parse sticker.json', () => {
    expect(() => {
      stickersJson = require('../stickers.json'); // tslint:disable-line no-require-imports
    }).not.toThrow();
  });

  it('should adhere to the stickers.json schema', () => {
    const validate = new Ajv().compile(schema);
    const isValid = validate(stickersJson);

    if (validate.errors) {
      validate.errors.forEach(error => {
        console.error(error);
      });
    }

    expect(isValid).toBe(true);
  });
});
