/**
 *
 */
export function variant(variants: any) {
  if (typeof variants !== 'object') {
    throw new Error(`Expected type of variants to be "object", got ${typeof variants}.`);
  }

  return (props: any) => {
    if (props.variant === undefined) {
      throw new Error(`Props did not contain a "variant" key.`);
    }

    if (variants[props.variant] === undefined) {
      throw new Error(`No variant defined for ${props.variant}.`);
    }

    return String(variants[props.variant]);
  };
}
