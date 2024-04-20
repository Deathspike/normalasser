import {ssa} from '../..';

export function getDurations(subtitle: ssa.Tree) {
  const entries = new Map<string, Entry>();
  run(subtitle, entries);
  return get(entries);
}

function get(entries: Map<string, Entry>) {
  const durations = new Map<string, number>();
  for (const [name, entry] of entries) durations.set(name, entry.duration);
  return durations;
}

function run(subtitle: ssa.Tree, entries: Map<string, Entry>) {
  const events = subtitle.events
    .filter(x => x.value.key.is('Dialogue'))
    .sort((a, b) => a.getTime('Start') - b.getTime('Start'));
  for (const event of events) {
    const style = event.getString('Style') ?? 'Default';
    const previous = entries.get(style) ?? {duration: 0, end: 0};
    const start = Math.max(event.getTime('Start'), previous.end);
    const end = Math.max(event.getTime('End'), start);
    const duration = previous.duration + (end - start);
    entries.set(style, {end, duration});
  }
}

type Entry = {
  duration: number;
  end: number;
};
