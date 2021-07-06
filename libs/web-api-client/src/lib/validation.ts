export const validationMessages = {
  slug: 'May only contain letters, numbers and hyphens (max 25 chars)',
  uniqueAccount: 'An account with the given email already exists.',
  urlable: 'May only contain letters, numbers, hyphens, underscores and spaces (max 25 chars).'
};

export const validationConstraints = {
  slugRegex: new RegExp('^[a-zA-Z0-9-]{2,25}$'),
  urlableRegex: new RegExp('^[a-zA-Z0-9_ -]{2,25}$')
};
