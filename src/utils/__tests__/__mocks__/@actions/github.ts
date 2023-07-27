export const getOctokit = jest.fn().mockReturnValue({
  rest: {
    repos: {
      listTags: jest.fn().mockResolvedValue({ data: [] }),
    },
  },
})
