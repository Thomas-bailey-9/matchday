// Turns a plan into a plain-text checklist that pastes cleanly into
// Notes, WhatsApp, Slack, Trello or an email.

import { outcomeLabels } from '../content/brand';
import type { Plan } from './types';

export function toChecklist(plan: Plan): string {
  const labels = outcomeLabels[plan.mode];
  const lines: string[] = [`MATCHDAY PLAN: ${plan.title}`, plan.subtitle, ''];
  for (const phase of plan.phases) {
    if (!phase.items.length) continue;
    lines.push(phase.title.toUpperCase());
    for (const item of phase.items) {
      const when = item.dateLabel ? `${item.timeLabel} (${item.dateLabel})` : item.timeLabel;
      const tag = !plan.outcome && item.outcomes ? ` [if ${item.outcomes.map((o) => labels[o].toLowerCase()).join(' or ')}]` : '';
      lines.push(`[ ] ${when}: ${item.title}${tag}`);
      lines.push(`    ${item.format} · ${item.channels.join(', ')}`);
      lines.push(`    Caption: ${item.caption}`);
    }
    lines.push('');
  }
  lines.push('Made with Matchday, an independent planning tool.');
  return lines.join('\n');
}
