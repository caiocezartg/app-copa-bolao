import * as yup from "yup";

const gameSchema = yup.object({
  params: yup.object({
    id: yup.string().required().strict(),
  }),
});

export default gameSchema;
