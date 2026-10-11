import { toCsv } from './csv';
it('escapes commas, quotes and formula injection', () => {
  expect(toCsv([{ a: 'x,y', b: 'say "hi"', c: '=SUM(A1)' }])).toBe('a,b,c\n"x,y","say ""hi""",\'=SUM(A1)');
});
