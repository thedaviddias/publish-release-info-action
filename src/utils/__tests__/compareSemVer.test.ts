import { compareSemVer } from '../compareSemVer'

describe('compareSemVer', () => {
  test('it should correctly compare version numbers', () => {
    expect(compareSemVer('v1.0.0', 'v1.0.0')).toBe(0)
    expect(compareSemVer('v1.0.0', 'v0.9.9')).toBe(-1)
    expect(compareSemVer('v1.0.0', 'v1.0.1')).toBe(1)
    expect(compareSemVer('v1.2.3', 'v1.2')).toBe(-1)
    expect(compareSemVer('v1.0.0', 'v1.0.1')).toBe(1)
  })
})
