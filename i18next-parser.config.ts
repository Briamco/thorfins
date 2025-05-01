const config = {
  locales: ['en', 'es'],
  defaultNamespace: 'translation',
  output: 'locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  keySeparator: false,
  namespaceSeparator: false,
};

export default config;
