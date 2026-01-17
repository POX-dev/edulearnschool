// UV config
self.__uv$config = {
  // prefix used by the UV service (relative to index.html location)
  prefix: "uv/service/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "uv/uv.handler.js",
  client: "uv/uv.client.js",
  bundle: "uv/uv.bundle.js",
  config: "uv/uv.config.js",
  sw: "uv/uv.sw.js",
};