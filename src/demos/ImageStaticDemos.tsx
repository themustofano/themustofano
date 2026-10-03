import { DemoCanvas } from './shared';

function ImageStaticDemo({ label, src, height }: { label: string; src: string; height: number }) {
  return <DemoCanvas label={label}>
    <img className="image-static-artwork" src={src} alt="" width="700" height={height} draggable={false} />
  </DemoCanvas>;
}

export function AllInOneDemo() {
  return <ImageStaticDemo label="The All-in-One App Era Is Over static design" src="/assets/all-in-one-app-era.png" height={590} />;
}

export function FutureDemo() {
  return <ImageStaticDemo label="Build What You Need / Future static design" src="/assets/build-what-you-need.png" height={549} />;
}

export function CollectiveDemo() {
  return <ImageStaticDemo label="D/G/TAL MAKER COLLECT/VE static design" src="/assets/digital-maker-collective.png" height={549} />;
}
