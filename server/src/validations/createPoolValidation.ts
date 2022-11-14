import * as yup from "yup";

const createPoolSchema = yup.object({
  body: yup.object({
    title: yup.string().required("Title is a required field.").strict(),
  }),
});

export default createPoolSchema;
