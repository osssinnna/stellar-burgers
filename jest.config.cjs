module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@ui-pages(.*)$': '<rootDir>/src/pages/ui$1',
    '^@ui(.*)$': '<rootDir>/src/components/ui$1',
    '^@api(.*)$': '<rootDir>/src/utils/burger-api$1',
    '^@utils-types(.*)$': '<rootDir>/src/utils/types$1'
  }
};
