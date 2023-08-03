import { compareSemVer } from '../compareSemVer'

describe('compareSemVer', () => {
  test('it should correctly compare version numbers', () => {
    expect(compareSemVer('1.0.0', '1.0.0')).toBe(0)
    expect(compareSemVer('1.0.0', '0.9.9')).toBe(1)
    expect(compareSemVer('1.0.0', '1.0.1')).toBe(-1)
    expect(compareSemVer('1.2.3', '1.2')).toBe(1)
    expect(compareSemVer('1.0', '1.0.1')).toBe(-1)
  })
})
