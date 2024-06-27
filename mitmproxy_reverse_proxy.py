from mitmproxy import http

def request(flow: http.HTTPFlow) -> None:
    if flow.request.path.startswith("/api"):
        flow.request.host = "localhost"
        flow.request.port = 8000
    else:
        flow.request.host = "localhost"
        flow.request.port = 3000


