import { logger } from "./applications/logging";
import { web } from "./applications/web";


const PORT = process.env.PORT || 3000;

web.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});