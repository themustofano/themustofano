import { DemoCanvas } from './shared';

export function PhoneDetectorDemo() {
  return <DemoCanvas label="Phone / AI Detector static design">
    <img className="phone-detector-artwork" src="/assets/phone-ai-detector.png" alt="" width="700" height="549" draggable={false} />
  </DemoCanvas>;
}
