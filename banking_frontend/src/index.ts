/**
 * Entry file for Remotion Studio and rendering.
 * Example:
 *   npx remotion render src/index.ts HelloWorld out/video.mp4
 */
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
