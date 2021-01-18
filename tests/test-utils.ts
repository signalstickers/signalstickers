import fs from 'fs';

import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import betterAjvErrors from 'better-ajv-errors';
import yaml from 'js-yaml';

/**
 * Schema for stickers.yml.
 */
const schema = {
  type: 'object',
  patternProperties: {
    // Pack IDs are 32 alphanumeric characters.
    '^[\\dA-Za-z]{32}$': {
      type: 'object',
      properties: {
        // Pack keys are 64 alphanumeric characters.
        key: {
          type: 'string',
          pattern: '^[\\dA-Za-z]{64}$',
          errorMessage: '"key" should be a 64-character string consisting of alphanumeric characters only.'
        },
        source: {
          type: 'string',
          errorMessage: '"source" should be a string.'
        },
        tags: {
          type: 'array',
          items: {
            type: 'string',
            errorMessage: {
              type: 'Each tag should be a string.'
            }
          },
          errorMessage: {
            type: '"tags" should be an array.'
          }
        },
        nsfw: {
          type: 'boolean',
          errorMessage: '"nsfw" should be a boolean.'
        },
        original: {
          type: 'boolean',
          errorMessage: '"original" should be a boolean.'
        },
        animated: {
          type: 'boolean',
          errorMessage: '"animated" should be a boolean.'
        }
      },
      // The only required field is 'key' and any additional fields not defined
      // in the spec are forbidden.
      required: ['key'],
      additionalProperties: false
    }
  },
  additionalProperties: false,
  errorMessage: {
    // N.B. If a sticker pack ID does not match the above pattern, it will be
    // counted as an "additional property" in the root object, and will throw an
    // additionalProperties error.
    additionalProperties: 'A sticker pack ID should be a 32-character string consisting of alphanumeric characters only.'
  }
};


/**
 * @private
 *
 * AJV instance with ajv-errors installed.
 */
const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);


/**
 * Validator function for the above schema.
 */
export const validate = ajv.compile(schema);


/**
 * Function that accepts an input object and returns a string suitable for
 * printing to the console which describes each error in the input object.
 */
export function parseErrors(input: any) {
  const output = betterAjvErrors(schema, input, validate.errors, { indent: 2 });

  if (output) {
    return output.toString();
  }

  throw new Error('An error occurred while parsing errors #meta.');
}


/**
 * Provided a path to a YAML file, loads the file, parses it, and returns a
 * JavaScript data structure. If the file is not valid YAML or contains a
 * syntax error, an error will be thrown.
 */
export function parseYaml(inputFilePath: string) {
  return yaml.load(fs.readFileSync(inputFilePath, { encoding: 'utf8' }));
}
