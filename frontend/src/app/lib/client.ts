
import * as Client from "./generated-client/services.gen"
import * as Types from "./generated-client/types.gen"
import { OpenAPI } from "./generated-client";
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_BASE_URL||"localhost:8000";
export {Client,Types,OpenAPI}