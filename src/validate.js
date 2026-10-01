import { ERAS, validate } from "./data.js";

const errors = validate();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`ok ${ERAS.length} eras`);
