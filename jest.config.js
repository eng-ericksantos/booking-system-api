module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Onde o Jest deve procurar pelos arquivos de teste
    testMatch: ['**/__tests__/**/*.spec.ts'], 
    // Ignora a pasta de build nos testes
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    // Limpa os mocks entre os testes para garantir o isolamento
    clearMocks: true,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};