// ---------------------------------------------------------------------------------------------------------------------
// Version Route
// ---------------------------------------------------------------------------------------------------------------------

import { Router } from 'express';

// Utils
import { getVersion } from '../utils/version.js';

// ---------------------------------------------------------------------------------------------------------------------

const router = Router();

// ---------------------------------------------------------------------------------------------------------------------

router.get('/', async (_req, resp) =>
{
    resp.json(await getVersion());
});

// ---------------------------------------------------------------------------------------------------------------------

export default router;

// ---------------------------------------------------------------------------------------------------------------------
