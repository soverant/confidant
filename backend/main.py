import logging

from logger import setup_logger
from config import get_config

conf = get_config()
setup_logger(conf.LOG_LEVEL)
log = logging.getLogger(__name__)

if __name__ == "__main__":
    import uvicorn
    log.info("API is ready on http://%s:%d", conf.HOST, conf.PORT)
    log.info("Docs available is ready on http://%s:%d/docs", conf.HOST, conf.PORT)
    uvicorn.run("api:app", host=conf.HOST, port=conf.PORT, reload=conf.RELOAD, workers=2)
