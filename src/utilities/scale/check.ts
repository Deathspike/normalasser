import * as ass from '../ass';

export function check(subtitle: ass.Tree) {
  const result = new Map<string, Entry>();
  run(subtitle, result);
  return result;
}

function run(subtitle: ass.Tree, result: Map<string, Entry>) {
  const events = subtitle.events
    .filter(x => x.value.key.is('Dialogue'))
    .sort((a, b) => a.getTime('Start') - b.getTime('Start'));
  for (const event of events) {
    const style = event.getString('Style') ?? 'Default';
    const previous = result.get(style) ?? {duration: 0, end: 0};
    const start = Math.max(event.getTime('Start'), previous.end);
    const end = Math.max(event.getTime('End'), start);
    const duration = previous.duration + (end - start);
    result.set(style, {end, duration: duration});
  }
}

type Entry = {
  duration: number;
  end: number;
};
