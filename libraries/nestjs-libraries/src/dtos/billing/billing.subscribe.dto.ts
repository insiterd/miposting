import { IsIn } from 'class-validator';

export class BillingSubscribeDto {
  @IsIn(['MONTHLY', 'YEARLY'])
  period: 'MONTHLY' | 'YEARLY';

  @IsIn(['STANDARD', 'PRO', 'ULTIMATE'])
  billing: 'STANDARD' | 'PRO' | 'ULTIMATE';

  utm: string;

  dub: string;

  datafast_session_id: string;
  datafast_visitor_id: string;
}
