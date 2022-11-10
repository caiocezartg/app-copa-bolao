import * as yup from "yup";

const poolSchema = yup.object({
  body: yup.object({
    title: yup.string().required("Title is a required field.").strict(),
  }),
});

export default poolSchema;
