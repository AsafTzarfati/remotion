import {Config} from '@remotion/cli/config';

// Use the browser that is already installed instead of downloading one.
const shell = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
import {existsSync} from 'fs';
if (existsSync(shell)) {
  Config.setBrowserExecutable(shell);
}

// High quality output.
Config.setVideoImageFormat('png');
Config.setCodec('h264');
Config.setCrf(14);
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setOverwriteOutput(true);
