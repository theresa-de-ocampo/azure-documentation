import "dotenv/config";
import queues from "./entities/queues/index.js";
import sendMesssages from "./entities/generic/sender.js";

export default { sendMesssages, queues };
