import { configService } from '../config/config.service';
import fs = require('fs');

let modified = configService.getTypeOrmConfig();
modified['port'] = process.env.POSTGRES_PORT;

fs.writeFileSync('ormconfig.json',
 JSON.stringify(modified, null, 2)
);
