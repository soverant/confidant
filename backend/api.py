import sys
import logging
from models import *
from fastapi import FastAPI, HTTPException

from config import get_config

try:
    conf = get_config()
    log = logging.getLogger(__name__)
    app = FastAPI()

except Exception as e:
    print("the app is ended with this error: %s", str(e))
    sys.exit(1)


@app.post("/sample")
async def sample_post(data: SampleDTO) -> SampleDTO:
    try:
        log.debug("sample post called")
        return data

    except Exception as e:
        err = str(e)
        log.error("sample post error: %s", err)
        raise HTTPException(
            status_code=500,
            detail=err
        )


