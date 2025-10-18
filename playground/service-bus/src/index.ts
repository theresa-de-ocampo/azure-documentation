import "dotenv/config";

import sendMesssages from "./entities/generic/sender.js";
import queues from "./entities/queues/index.js";
import topics from "./entities/topics/index.js";

export default { sendMesssages, queues, topics };
