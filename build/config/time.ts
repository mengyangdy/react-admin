import { Temporal } from '@js-temporal/polyfill';

export function getBuildTime(){
  const now=Temporal.Now.zonedDateTimeISO('Asia/Shanghai')
  return now.toLocaleString('sv-SE').replace('T', ' ')
}