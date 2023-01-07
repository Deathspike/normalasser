import * as ass from 'ass-compiler';

export function check(subtitle: ass.ParsedASS) {
  const result = new Map<string, Entry>();
  run(subtitle, result);
  return result;
}

function run(subtitle: ass.ParsedASS, result: Map<string, Entry>) {
  const events = subtitle.events.dialogue
    .slice()
    .sort((a, b) => a.Start - b.Start);
  for (const current of events) {
    const previous = result.get(current.Style) ?? {duration: 0, end: 0};
    const start = Math.max(current.Start, previous.end);
    const end = Math.max(current.End, start);
    const duration = previous.duration + (end - start);
    result.set(current.Style, {end, duration: duration});
  }
}

type Entry = {
  duration: number;
  end: number;
};
