const preprocessor = require.resolve('./preprocessor.js')
const polyfills = require.resolve('./polyfills.jsx')


const coverage = process.argv.indexOf('--coverage') !== -1
    ? {
        collectCoverage: true,
        collectCoverageFrom: [
            '**/src/**',
            '!**/fixtures/**',
            '!**/src/config/**',
            '!**/*.mod.scss',
            '!**/__snapshots__/**',
            '!**/constants/*'
        ],
        coverageDirectory: './coverage'
    }
    : {}

module.exports = {
    ...coverage,
    clearMocks: true,
    moduleFileExtensions: [ 'js', 'jsx', 'json' ],
    rootDir: process.cwd(),
    setupFiles: [ polyfills ],
    snapshotSerializers: [ require.resolve('enzyme-to-json/serializer') ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '.*.ignore.spec.*'
    ],
    transform: { '.*': preprocessor },
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!infra-constants)/'
    ]
}
