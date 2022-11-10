import * as yup from "yup";

const authSchema = yup.object({
  access_token: yup.string().strict(),
});

export default authSchema;
