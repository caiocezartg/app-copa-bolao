import * as yup from "yup";

const getPoolSchema = yup.object({
  params: yup.object({
    id: yup.string().strict(),
  }),
});

export default getPoolSchema;
