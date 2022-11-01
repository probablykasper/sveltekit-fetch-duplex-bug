import type { RequestHandler } from '@sveltejs/kit'

// Code from https://github.com/sindresorhus/ky/commit/316fffe5ad9a1a1329816b6d82d02e7da05b6f35

const supportsRequestStreams = (() => {
    let duplexAccessed = false;
    let hasContentType = false;
    const supportsReadableStream = typeof globalThis.ReadableStream === 'function';
    if (supportsReadableStream) {
        hasContentType = new globalThis.Request('https://a.com', {
            body: new globalThis.ReadableStream(),
            method: 'POST',
            // @ts-expect-error - Types are outdated.
            get duplex() {
                duplexAccessed = true;
                return 'half';
            },
        }).headers.has('Content-Type');
    }
    return duplexAccessed && !hasContentType;
})();

export const GET: RequestHandler = async () => {
    const request = new Request('https://example.com')

    console.log('supportsRequestStreams', supportsRequestStreams);

    if (supportsRequestStreams) {
        // @ts-expect-error - Types are outdated.
        request.duplex = 'half';
    }

  return new Response('Success')
}
