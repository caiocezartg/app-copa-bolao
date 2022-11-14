import * as yup from "yup";

const guessSchema = yup.object({
  params: yup.object({
    poolId: yup.string().required().strict(),
    gameId: yup.string().required().strict(),
  }),
  body: yup.object({
    firstTeamPoints: yup.number(),
    secondTeamPoints: yup.number(),
  }),
});

export default guessSchema;
