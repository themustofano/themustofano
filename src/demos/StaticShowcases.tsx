import { ShowcaseCard } from '../Portfolio';
import { showcases } from '../content';
import { DatePickerDemo } from './DatePickerDemo';
import { VoiceChatDemo } from './VoiceChatDemo';
import { NavigationDemo } from './NavigationDemo';
import { ComposerDemo } from './ComposerDemo';
import { AgentSelectorDemo } from './AgentSelectorDemo';
import { AnalyticsChartDemo } from './AnalyticsChartDemo';
import { PhoneDetectorDemo } from './PhoneDetectorDemo';
import { AllInOneDemo, FutureDemo, CollectiveDemo } from './ImageStaticDemos';
import { StaticPresentation, DesignCursor } from './shared';
import './demos.css';
import './new-static.css';
import './phone-static.css';
import './image-static.css';

const demos = { date: DatePickerDemo, voice: VoiceChatDemo, nav: NavigationDemo, composer: ComposerDemo, agent: AgentSelectorDemo, analytics: AnalyticsChartDemo, phone: PhoneDetectorDemo, 'all-in-one': AllInOneDemo, future: FutureDemo, collective: CollectiveDemo };
// Static demos are non-interactive illustrations.
const cursors = { date: [469, 227], nav: [200, 98], agent: [419, 169] } as const;
export default function StaticShowcases() {
  return <StaticPresentation value={true}>{showcases.map(item => {
    const Demo = demos[item.id];
    const cursor = item.id in cursors ? cursors[item.id as keyof typeof cursors] : undefined;
    return <ShowcaseCard key={item.id} item={item}>
      <div className="coded-artwork" inert data-figma-node={item.node}>
        <Demo />
        {cursor && <div className="cursor-coordinate-space"><DesignCursor x={cursor[0]} y={cursor[1]} /></div>}
      </div>
    </ShowcaseCard>;
  })}</StaticPresentation>;
}
