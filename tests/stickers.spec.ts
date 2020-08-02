import Ajv from 'ajv';
import yaml from 'js-yaml';
import fs from 'fs';


/**
 * YML Schema for stickers.yml.
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
          type: 'array',
          items: {
            type: 'string'
          }
        },
        nsfw: {
          type: 'boolean'
        },
        original: {
          type: 'boolean'
        },
        animated: {
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


describe('stickers.yml', () => {
  let stickersYml: any;

  // This will throw if there are any syntax errors in the file.
  it('should be able to parse sticker.yml', () => {
    expect(() => {
      stickersYml = yaml.safeLoad(fs.readFileSync('./stickers.yml', {encoding: 'utf8'}));
    }).not.toThrow();
  });

  it('should adhere to the stickers.yml schema', () => {
    const validate = new Ajv().compile(schema);
    const isValid = validate(stickersYml);

    if (validate.errors) {
      validate.errors.forEach(error => {
        console.error(error);
      });
    }

    expect(isValid).toBe(true);
  });
});
