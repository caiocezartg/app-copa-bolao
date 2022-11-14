import * as yup from "yup";

const poolCodeSchema = yup.object({
  body: yup.object({
    code: yup.string().required().strict(),
  }),
});

export default poolCodeSchema;
