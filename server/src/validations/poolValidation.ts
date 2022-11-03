import * as yup from "yup";

const poolSchema = yup.object({
  title: yup.string().strict().required(),
  code: yup.string().strict(),
});

export default poolSchema;
