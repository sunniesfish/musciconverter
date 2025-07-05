export async function streamToJson(
  stream: ReadableStream<Uint8Array>,
): Promise<any> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode(); // flush

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error('Failed to parse JSON from stream: ' + err);
  }
}
