
import * as Client from "./generated-client/services.gen"
import * as Types from "./generated-client/types.gen"
import { OpenAPI } from "./generated-client";
import { BASE_URL } from "./constants";
OpenAPI.BASE = BASE_URL;
export {Client,Types,OpenAPI}