import { reqCode, connect } from "./api/spotify/auth.js";
const params = new URLSearchParams(location.search);
const code = params.get("code");
const state = params.get("state");
const force = params.get("force") != null;
// wether to force full auth (mainly to request a token with higher privileges)
if (force)
    reqCode();
else
    connect(code, state);
